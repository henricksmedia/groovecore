# 🥁 Cakewalk Drum Map for GrooveCore MIDI Files

## Creating a Custom Drum Map in Cakewalk

Since you mentioned drum maps, here's how to create a custom drum map that will label all your GrooveCore instruments correctly in Cakewalk:

---

## 📋 **GrooveCore → GM Drum Map**

| **GrooveCore** | **MIDI Note** | **GM Name** | **Cakewalk Label** |
|----------------|---------------|-------------|-------------------|
| **BD** (Bass Drum) | 36 | Bass Drum 1 | Kick |
| **SD** (Snare) | 38 | Acoustic Snare | Snare |
| **RIM** (Rim Shot) | 37 | Side Stick | Rim |
| **CH** (Clap) | 39 | Hand Clap | Clap |
| **HC** (Hi-Hat Closed) | 42 | Closed Hi-Hat | HH Closed |
| **MC** (Hi-Hat Mid) | 44 | Pedal Hi-Hat | HH Pedal |
| **LC** (Hi-Hat Open) | 46 | Open Hi-Hat | HH Open |
| **OH** (Open Hat) | 46 | Open Hi-Hat | HH Open Alt |
| **LT** (Low Tom) | 45 | Low Tom | Tom Low |
| **MT** (Mid Tom) | 47 | Low-Mid Tom | Tom Mid |
| **HT** (High Tom) | 50 | High Tom | Tom High |
| **CR** (Crash) | 49 | Crash Cymbal 1 | Crash 1 |
| **CYM** (Cymbal) | 57 | Crash Cymbal 2 | Crash 2 |
| **CB** (Cowbell) | 56 | Cowbell | Cowbell |
| **CL** (Clave) | 75 | Claves | Claves |
| **MA** (Maraca) | 70 | Maracas | Maracas |

---

## 🛠️ **Creating the Drum Map in Cakewalk:**

### **Method 1: Built-in GM Drum Map**
1. **Select your MIDI track** (Channel 10)
2. **Right-click** → **Insert Soft Synth** → **TTS-1** or **SI-Drum Kit**
3. In **Piano Roll View**, go to **View** → **Drum Map**
4. Select **"GM Drums"** from the dropdown
5. All notes will now show proper drum names!

### **Method 2: Custom Drum Map File**
1. Go to **View** → **Drum Maps**
2. Click **New** to create a custom map
3. Name it **"GrooveCore TR-808"**
4. Add each note with the labels from the table above

---

## 🎯 **Step-by-Step Setup for GrooveCore MIDI:**

### **1. Import Your MIDI File**
```
File → Import → MIDI
```

### **2. Set Up Channel 10 with GM Sounds**
```
Track → Insert Soft Synth → TTS-1 (or SI-Drum Kit)
Ensure MIDI Channel = 10
```

### **3. Apply Drum Map**
```
Piano Roll View → View → Drum Map → GM Drums
```

### **4. Verify Setup**
- You should see drum names instead of note numbers
- "Kick" at the bottom, "Hi-Hat" in the middle, etc.
- Play the track - you should hear GM drum sounds

---

## 🎵 **Testing Your Setup:**

### **Quick Test Pattern:**
Your GrooveCore exports should show these sounds:
- **Beat 1**: Kick (BD) - Note 36
- **Beat 2**: Snare (SD) - Note 38  
- **Beat 3**: Kick (BD) - Note 36
- **Beat 4**: Snare + Clap (SD+CH) - Notes 38+39

If you hear these sounds in the right places, everything is working!

---

## 💡 **Pro Tips:**

### **For Better 808 Sound:**
- Load **808 samples** into your favorite drum sampler
- Map them to the same MIDI notes as above
- Use **BFD3**, **Superior Drummer**, or **Battery** for authentic sounds

### **For Easy Editing:**
- Use the **Multi-Track Export** option in GrooveCore (Shift+Click MIDI button)
- This creates separate tracks for each instrument
- Much easier to process and mix individual elements

### **For Pattern Variations:**
- Import multiple GrooveCore patterns to different tracks
- Use Cakewalk's **Pattern Brush** to arrange them
- Create full song structures from your 808 patterns

---

## 🔧 **Troubleshooting:**

### **"Still no drum names showing"**
- Make sure track is on **Channel 10**
- Verify **GM Drums** is selected in drum map dropdown
- Try switching to **Piano Roll View** first

### **"Wrong sounds playing"**
- Check your synth is GM-compatible (TTS-1 works great)
- Verify MIDI channel 10 is routed to drums, not melody
- Some synths need manual drum kit selection

### **"Missing some drums"**
- Not all GM synths support every percussion note
- Try **SI-Drum Kit** for full GM support
- Or use a dedicated drum VST

---

## 📁 **Save Your Setup:**

Once you have this working perfectly:
1. **Save as Template**: File → Save As Template
2. Name it **"GrooveCore Import Template"**  
3. Future GrooveCore imports will automatically use this setup!

This way, every time you import a GrooveCore MIDI file, Cakewalk will automatically:
- Set up Channel 10 with GM drums
- Apply the correct drum map labels
- Route to your preferred drum synth

**Your GrooveCore patterns will now display and play perfectly in Cakewalk with proper drum names and authentic sounds!**
