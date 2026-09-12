# API Keys Setup Guide & Security Practices

This guide outlines how to configure your environment variables securely for **WeatherGPT**.

---

## 1. Environment Variable Architecture & Security

To prevent client-side credential exposure and ensure zero-leakage security:

- **Server-Side API Keys**:
  - `GEMINI_API_KEY`: Used strictly by the backend server for AI model synthesis, disaster reports, and persona reasoning. Never exposed to browser code.
  - `OPENWEATHER_API_KEY`: Kept on the server side to proxy live weather queries, preventing public quota exhaustion.
  - `FIREBASE_API_KEY`: Used for backend operations and environment configuration.
- **Client-Side Variables**:
  - Only non-sensitive or publicly intended keys (such as `VITE_GOOGLE_MAPS_API_KEY`) may carry the `VITE_` prefix for client-rendered map layers.

---

## 2. Where to Add Your Keys

In Google AI Studio and modern cloud containers:
1. Open the project **Settings / Secrets** menu in the interface (or create your `.env` file in the root directory).
2. Ensure the `.env` file is located at the project root (`./.env`). Note: `.gitignore` is already configured with `.env*` to prevent accidental commits to source control.

---

## 3. Recommended `.env` Template

Create or open `.env` in the root directory:

```env
# -------------------------------------------------------------
# Google Gemini API Key (Server-side AI processing)
# -------------------------------------------------------------
GEMINI_API_KEY=your_gemini_api_key_here

# -------------------------------------------------------------
# Firebase Web API Key
# -------------------------------------------------------------
FIREBASE_API_KEY=your_firebase_api_key_here

# -------------------------------------------------------------
# OpenWeatherMap API Key (Server-side weather proxy)
# -------------------------------------------------------------
OPENWEATHER_API_KEY=your_openweather_api_key_here

# -------------------------------------------------------------
# Google Maps Platform API Key (Interactive radar, vector maps, and geocoding)
# -------------------------------------------------------------
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 4. Key Security Best Practices

1. **Never Commit `.env`**: Always confirm `.env` is listed in `.gitignore` (which is already configured here with `.env*` and `!.env.example`).
2. **Restrict API Keys in Cloud Consoles**:
   - **Google Cloud / Maps Key**: Restrict the key to specific HTTP referrers (your app domain) and API scopes (Maps JavaScript API, Places API, Geocoding API).
   - **Gemini API Key**: Restrict to the Generative Language API in Google Cloud Console.
   - **OpenWeatherMap Key**: Set rate limits or billing alerts in the OpenWeather dashboard.
3. **Keep Client Bundle Clean**: Never prefix backend keys (`GEMINI_API_KEY`, `OPENWEATHER_API_KEY`) with `VITE_`, as Vite embeds any `VITE_*` variable directly into public JavaScript bundles sent to the browser.
