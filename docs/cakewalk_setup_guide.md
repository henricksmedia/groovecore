# 🎵 Cakewalk Setup Guide for GrooveCore MIDI Import

## Problem: Imported MIDI files play no sound in Cakewalk

This is a common issue! The MIDI file is importing correctly, but Cakewalk needs to be configured to play General MIDI drums.

---

## ✅ **Quick Fix (Most Common Solution):**

### **Step 1: Check Track Settings**
1. After importing the MIDI file, look at the track in Cakewalk
2. Make sure the track is set to **Channel 10** (GM Drums)
3. The track should show **"Drums"** or **"Channel 10"**

### **Step 2: Assign a Drum Instrument**
1. **Right-click** on the track
2. Select **"Insert Synth"** → **"Instrument"**
3. Choose one of these options:
   - **"SI-Drum Kit"** (Cakewalk's built-in drums) ✅ **RECOMMENDED**
   - **"TTS-1"** (Microsoft GS Wavetable) 
   - **"Cakewalk Sound Center"** (if available)
   - Any other drum VST you have installed

### **Step 3: Verify Channel Assignment**
1. In the **Console View** (press `Alt+3`)
2. Find your drum track
3. Make sure **MIDI Channel** is set to **10**
4. Make sure **Input** shows the synth you selected

---

## 🔧 **Alternative Solutions:**

### **Option A: Use SI-Drum Kit (Recommended)**
```
1. Insert → Soft Synths → SI-Drum Kit
2. This creates a dedicated drum track
3. Route your imported MIDI to this track
```

### **Option B: Use TTS-1 (Built-in GM Synth)**
```
1. Insert → Soft Synths → TTS-1
2. Set MIDI channel to 10
3. Select a drum kit from the TTS-1 interface
```

### **Option C: Route to External MIDI Device**
```
1. Go to Edit → Preferences → MIDI → Devices
2. Enable your MIDI interface output
3. Route the track to external hardware
```

---

## 🎯 **Verification Steps:**

### **Test if MIDI Data is There:**
1. Open **Piano Roll View** (`Alt+5`)
2. You should see notes at the bottom (MIDI notes 35-81)
3. Notes should be on **Channel 10**

### **Test Playback:**
1. Press **Space** to play
2. Watch the **Console View** - you should see MIDI activity
3. If you see activity but no sound, it's a synth routing issue

---

## 🚨 **Common Issues & Solutions:**

### **Issue: "Track shows notes but no sound"**
**Solution:** Missing drum synth assignment
- Insert SI-Drum Kit or TTS-1 as described above

### **Issue: "Wrong drum sounds (kick sounds like piano)"**
**Solution:** Track not on Channel 10
- Set MIDI channel to 10 in Console View
- Or re-import and ensure it imports to Channel 10

### **Issue: "Some drums missing"**
**Solution:** Limited drum kit
- Try different drum synth (SI-Drum Kit has full GM set)
- Check if all MIDI notes 35-81 are supported

### **Issue: "Timing sounds off"**
**Solution:** Quantization or tempo issues
- Check if tempo imported correctly (should match your GrooveCore tempo)
- Disable auto-quantization if enabled

---

## 📋 **GrooveCore MIDI Export Details:**

Your MIDI files export with these settings:
- **Channel:** 10 (GM Percussion Standard)
- **Program:** 0 (GM Standard Drum Kit)
- **Note Range:** 35-81 (GM Percussion Range)
- **Format:** Type 1 MIDI file
- **Resolution:** 480 PPQ (high resolution)

**Instrument Mapping:**
- Bass Drum (BD) → MIDI Note 36
- Snare Drum (SD) → MIDI Note 38  
- Clap (CH) → MIDI Note 39
- Closed Hi-Hat (HC) → MIDI Note 42
- Open Hi-Hat (LC/OH) → MIDI Note 46
- Cowbell (CB) → MIDI Note 56
- And 10+ more instruments...

---

## 🎛️ **Pro Tips for Better Results:**

### **For Mixing:**
- Use **Shift+Click** in GrooveCore for **Multi-Track Export**
- This creates separate tracks for each instrument
- Much easier to mix and process individual drums

### **For Authentic 808 Sound:**
- Load an **808 drum sample pack** into your favorite drum VST
- Map the MIDI notes to match GrooveCore's mapping
- Use **BFD**, **Superior Drummer**, or **Addictive Drums** for pro results

### **For Quick Testing:**
- Use **SI-Drum Kit** first - it's simple and works immediately
- Once confirmed working, experiment with other drum VSTs

---

## 🆘 **Still No Sound? Try This:**

1. **Create a new MIDI track manually:**
   - Insert → MIDI Track
   - Set channel to 10
   - Add SI-Drum Kit
   - Copy/paste your imported MIDI data

2. **Check Audio Output:**
   - Make sure Cakewalk's audio engine is running
   - Check your audio interface settings
   - Test with a simple instrument first

3. **Verify MIDI Import:**
   - Try importing a different MIDI file to confirm Cakewalk is working
   - Check if other MIDI tracks in the same project play sound

---

## 📞 **Quick Checklist:**

- [ ] Track is on Channel 10
- [ ] Drum synth is inserted (SI-Drum Kit recommended)
- [ ] MIDI notes are visible in Piano Roll (notes 35-81)
- [ ] Console shows MIDI activity during playback
- [ ] Audio engine is running
- [ ] Track is not muted/soloed incorrectly

**Once you get sound, your GrooveCore patterns will play exactly as they do in the web app - with proper swing, velocities, and all the groove intact!**
