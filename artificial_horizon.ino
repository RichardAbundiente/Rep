/*
 * Artificial Horizon (Attitude Indicator)
 * Hardware: ESP32-S3 + LIS3DH + ST7735S 1.44" TFT
 *
 * Libraries required (install via Arduino Library Manager):
 *   - Adafruit ST7735 and ST7789 Library
 *   - Adafruit GFX Library
 *   - Adafruit LIS3DH
 *   - Adafruit BusIO
 *
 * === PIN WIRING ===
 *
 * ST7735S TFT (SPI):
 *   VCC   → 3.3V
 *   GND   → GND
 *   SCL   → GPIO 12 (SCLK)
 *   SDA   → GPIO 11 (MOSI)
 *   RES   → GPIO 9  (RESET)
 *   DC    → GPIO 8  (Data/Command)
 *   CS    → GPIO 10 (Chip Select)
 *   BLK   → 3.3V (backlight always on) or GPIO for PWM dimming
 *
 * LIS3DH (I2C):
 *   VIN   → 3.3V
 *   GND   → GND
 *   SCL   → GPIO 2
 *   SDA   → GPIO 1
 *   (SA0/SDO pulled LOW → I2C address 0x18)
 *   (SA0/SDO pulled HIGH → I2C address 0x19)
 *
 * Adjust pin definitions below to match your wiring.
 */

#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <Adafruit_LIS3DH.h>
#include <Adafruit_Sensor.h>
#include <SPI.h>
#include <Wire.h>
#include <math.h>

// ─── TFT Pin Definitions ─────────────────────────────────────────────────────
#define TFT_CS    10
#define TFT_DC     8
#define TFT_RST    9
#define TFT_SCLK  12
#define TFT_MOSI  11

// ─── I2C Pins ────────────────────────────────────────────────────────────────
#define I2C_SDA    1
#define I2C_SCL    2
#define LIS3DH_ADDR 0x18  // Change to 0x19 if SA0 is HIGH

// ─── Display Dimensions (ST7735S 1.44" = 128x128) ───────────────────────────
#define SCREEN_W  128
#define SCREEN_H  128
#define CX        (SCREEN_W / 2)   // Center X = 64
#define CY        (SCREEN_H / 2)   // Center Y = 64

// ─── Horizon Colors ──────────────────────────────────────────────────────────
#define SKY_COLOR   0x04FF   // Aviation blue
#define GND_COLOR   0x5200   // Earth brown
#define HOR_COLOR   0xFFFF   // White horizon line
#define MARK_COLOR  0xFFFF   // White pitch/roll marks
#define CROSS_COLOR 0xF800   // Red aircraft reference symbol
#define TEXT_COLOR  0xFFFF
#define BG_OVERLAY  0x0000   // Black for text areas
#define WARN_COLOR  0xF800   // Red

// ─── Smoothing ───────────────────────────────────────────────────────────────
#define ALPHA 0.15f           // Low-pass filter coefficient (lower = smoother)

// ─── Globals ─────────────────────────────────────────────────────────────────
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_MOSI, TFT_SCLK, TFT_RST);
Adafruit_LIS3DH lis = Adafruit_LIS3DH();

float smoothRoll  = 0.0f;
float smoothPitch = 0.0f;

// ─── Helper: fast integer swap ───────────────────────────────────────────────
inline void swap_i(int &a, int &b) { int t = a; a = b; b = t; }

// ─── Draw a rotated & pitched artificial horizon ─────────────────────────────
//
//  Strategy: rasterise scanline-by-scanline, determining whether each pixel
//  is sky or ground by rotating the pixel about the center by -roll, then
//  checking if the resulting Y is above or below a pitch offset.
//
void drawHorizon(float rollDeg, float pitchDeg) {
  // Pitch offset in pixels: 1° ≈ 2 px at this scale
  float pitchOffset = pitchDeg * 2.0f;
  if (pitchOffset >  CY) pitchOffset =  CY;
  if (pitchOffset < -CY) pitchOffset = -CY;

  float rollRad = rollDeg * M_PI / 180.0f;
  float sinR = sinf(rollRad);
  float cosR = cosf(rollRad);

  // Draw sky/ground background pixel-by-pixel using fillRect rows for speed
  // We process per-row: compute leftmost and rightmost sky/ground boundary
  for (int y = 0; y < SCREEN_H; y++) {
    int py = y - CY;

    // Find the x at which the horizon line crosses this row
    // Horizon line equation (rotated): cosR*(px) + sinR*(py) = pitchOffset
    // At horizon: cosR*px + sinR*py = pitchOffset → px = (pitchOffset - sinR*py)/cosR
    // But we check per-pixel using dot product for correctness:
    // A pixel (px,py) is sky if: -sinR*px + cosR*py < pitchOffset  (rotated normal)

    // We'll fill each row with two rectangles: one sky segment, one ground segment
    // Determine if the horizon line intersects this row and where
    float horizonX; // x where horizon crosses this row (in centered coords)
    bool entireSky   = false;
    bool entireGround = false;

    if (fabsf(cosR) < 0.0001f) {
      // Roll ≈ 90°, horizon is vertical
      if (py < pitchOffset) entireSky    = true;
      else                   entireGround = true;
    } else {
      horizonX = (pitchOffset - sinR * py) / cosR;
    }

    // For each row, draw left segment and right segment
    if (entireSky) {
      tft.drawFastHLine(0, y, SCREEN_W, SKY_COLOR);
    } else if (entireGround) {
      tft.drawFastHLine(0, y, SCREEN_W, GND_COLOR);
    } else {
      // Determine which side is sky (left or right of horizonX)
      // Normal to horizon line (pointing to sky): (-sinR, cosR)
      // Test a point far left (px = -100): sky if -sinR*(-100) + cosR*py < pitchOffset
      // → 100*sinR + cosR*py < pitchOffset
      float testVal = 100.0f * sinR + cosR * py;
      bool leftIsSky = (testVal < pitchOffset);

      int hx = (int)(horizonX + CX);  // convert to screen coords
      hx = constrain(hx, 0, SCREEN_W);

      if (leftIsSky) {
        if (hx > 0)          tft.drawFastHLine(0,  y, hx,           SKY_COLOR);
        if (hx < SCREEN_W)   tft.drawFastHLine(hx, y, SCREEN_W-hx,  GND_COLOR);
      } else {
        if (hx > 0)          tft.drawFastHLine(0,  y, hx,           GND_COLOR);
        if (hx < SCREEN_W)   tft.drawFastHLine(hx, y, SCREEN_W-hx,  SKY_COLOR);
      }
    }
  }

  // ─── Horizon line ───────────────────────────────────────────────────────
  // Draw a thick white line along the horizon
  float len = SCREEN_W * 0.8f;
  int x1 = (int)(CX - cosR * len / 2);
  int y1 = (int)(CY - sinR * len / 2 - pitchOffset * cosR);
  int x2 = (int)(CX + cosR * len / 2);
  int y2 = (int)(CY + sinR * len / 2 - pitchOffset * cosR);
  // Slightly offset for proper pitch positioning
  y1 = (int)(CY - sinR * len / 2 + pitchOffset * cosR);
  y2 = (int)(CY + sinR * len / 2 + pitchOffset * cosR);
  // Correct horizon center point with pitch
  int hcx1 = (int)(CX - cosR * len / 2 - sinR * pitchOffset);
  int hcy1 = (int)(CY + sinR * len / 2 - cosR * pitchOffset);  // wait — let's do this properly
  int hcx2 = (int)(CX + cosR * len / 2 - sinR * pitchOffset);
  int hcy2 = (int)(CY - sinR * len / 2 - cosR * pitchOffset);

  // Draw thick horizon line (3px)
  tft.drawLine(hcx1, hcy1, hcx2, hcy2, HOR_COLOR);
  tft.drawLine(hcx1+1, hcy1+1, hcx2+1, hcy2+1, HOR_COLOR);
  tft.drawLine(hcx1-1, hcy1-1, hcx2-1, hcy2-1, HOR_COLOR);

  // ─── Pitch ladder marks (±10°, ±20°) ──────────────────────────────────
  for (int deg = -20; deg <= 20; deg += 10) {
    if (deg == 0) continue;
    float poff = (pitchOffset - deg * 2.0f); // offset of this pitch line from center
    float lineLen = (abs(deg) == 10) ? 20.0f : 30.0f;

    int mx1 = (int)(CX - cosR * lineLen / 2 - sinR * poff);
    int my1 = (int)(CY + sinR * lineLen / 2 - cosR * poff);
    int mx2 = (int)(CX + cosR * lineLen / 2 - sinR * poff);
    int my2 = (int)(CY - sinR * lineLen / 2 - cosR * poff);

    tft.drawLine(mx1, my1, mx2, my2, MARK_COLOR);
  }

  // ─── Roll arc tick marks at top ────────────────────────────────────────
  int arcR = 56;
  int angles[] = {-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60};
  for (int i = 0; i < 11; i++) {
    float angRad = (angles[i] - rollDeg) * M_PI / 180.0f - M_PI / 2.0f;
    int tickLen = (angles[i] % 30 == 0) ? 8 : 4;
    int ox = (int)(CX + arcR * cosf(angRad));
    int oy = (int)(CY + arcR * sinf(angRad));
    int ix = (int)(CX + (arcR - tickLen) * cosf(angRad));
    int iy = (int)(CY + (arcR - tickLen) * sinf(angRad));
    tft.drawLine(ox, oy, ix, iy, MARK_COLOR);
  }

  // ─── Roll pointer triangle (fixed, at top center) ─────────────────────
  int tp = CY - arcR;
  tft.fillTriangle(CX, tp + 5, CX - 4, tp + 12, CX + 4, tp + 12, MARK_COLOR);

  // ─── Aircraft symbol (fixed center reference) ─────────────────────────
  // Wings
  tft.drawFastHLine(CX - 22, CY, 14, CROSS_COLOR);
  tft.drawFastHLine(CX +  8, CY, 14, CROSS_COLOR);
  // Center dot
  tft.fillCircle(CX, CY, 3, CROSS_COLOR);
  // Tail
  tft.drawFastHLine(CX - 5, CY - 6, 10, CROSS_COLOR);
}

// ─── Draw HUD overlay (pitch/roll text) ──────────────────────────────────────
void drawHUD(float roll, float pitch) {
  tft.setTextSize(1);
  tft.setTextColor(TEXT_COLOR, BG_OVERLAY);

  // Bottom left: Roll
  tft.setCursor(2, SCREEN_H - 16);
  tft.print("R:");
  if (roll >= 0) tft.print(" ");
  tft.print((int)roll);
  tft.print((char)247); // degree symbol substitute

  // Bottom right: Pitch
  tft.setCursor(SCREEN_W - 44, SCREEN_H - 16);
  tft.print("P:");
  if (pitch >= 0) tft.print(" ");
  tft.print((int)pitch);
  tft.print((char)247);

  // Warning if extreme angles
  if (fabsf(roll) > 60 || fabsf(pitch) > 30) {
    tft.setTextColor(WARN_COLOR, BG_OVERLAY);
    tft.setCursor(CX - 12, 6);
    tft.print("WARN");
    tft.setTextColor(TEXT_COLOR, BG_OVERLAY);
  }
}

// ─── Setup ────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(200);

  // Init I2C for LIS3DH
  Wire.begin(I2C_SDA, I2C_SCL);

  // Init LIS3DH
  if (!lis.begin(LIS3DH_ADDR)) {
    Serial.println("LIS3DH not found! Check wiring and I2C address.");
    while (1) delay(100);
  }
  lis.setRange(LIS3DH_RANGE_2_G);
  lis.setDataRate(LIS3DH_DATARATE_100_HZ);
  Serial.println("LIS3DH initialized.");

  // Init TFT
  tft.initR(INITR_144GREENTAB);  // Use INITR_BLACKTAB if colors look wrong
  tft.setRotation(2);             // Adjust 0-3 to match your display orientation
  tft.fillScreen(ST77XX_BLACK);
  Serial.println("TFT initialized.");

  // Splash
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(1);
  tft.setCursor(10, 50);
  tft.print("ARTIFICIAL");
  tft.setCursor(22, 62);
  tft.print("HORIZON");
  tft.setCursor(16, 80);
  tft.print("Initializing...");
  delay(1200);
}

// ─── Main Loop ────────────────────────────────────────────────────────────────
void loop() {
  // Read accelerometer
  sensors_event_t event;
  lis.getEvent(&event);

  float ax = event.acceleration.x;
  float ay = event.acceleration.y;
  float az = event.acceleration.z;

  // Compute roll and pitch from accelerometer
  // Roll  = atan2(ay, az)
  // Pitch = atan2(-ax, sqrt(ay*ay + az*az))
  float rawRoll  = atan2f(ay, az) * 180.0f / M_PI;
  float rawPitch = atan2f(-ax, sqrtf(ay * ay + az * az)) * 180.0f / M_PI;

  // Low-pass filter
  smoothRoll  += ALPHA * (rawRoll  - smoothRoll);
  smoothPitch += ALPHA * (rawPitch - smoothPitch);

  // Draw horizon
  drawHorizon(smoothRoll, smoothPitch);
  drawHUD(smoothRoll, smoothPitch);

  // ~20 fps target (scanline rendering is slow without DMA)
  delay(10);
}
