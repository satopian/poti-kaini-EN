# POTI-board EVO EN

## Serious bugs in older versions
- POTI-board v2.26.0 and earlier all versions is vulnerable to XSS.    
Malicious JavaScript can be executed.

- POTI-board v3.09.x and earlier all versions have a serious bug.  
You may lose all log files.

- POTI-board v3.x gives a deprecated error in PHP8.1 It will not work with future versions of PHP.

Please update to v5.x or higher.

## A POTI-board that can use HTML5 versions of PaintBBS NEO ,tegaki.js , Axnos Paint , ChickenPaint , and klecks.

![PaintBBS NEO](https://user-images.githubusercontent.com/44894014/130362908-27922b42-6a4c-4c73-8ab6-a1f678014eed.png)

![ChickenPaint](https://user-images.githubusercontent.com/44894014/130363514-1ac820bf-0c6b-4cfa-ba47-62e0b40c3e74.png)


In v3.0, the HTML5 version of the high-performance paint application [ChickenPaint](https://github.com/thenickdude/chickenpaint) is available.  
The HTML5 version of [PaintBBS NEO](https://github.com/funige/neo/) is still available.


This is a project to translate [POTI-board EVO](https://github.com/satopian/poti-kaini/) into English.

[POTI-board Kai official website](https://paintbbs.sakura.ne.jp/poti/?en=on) English.

## Required php version

Required PHP version.PHP7.4 to PHP8.5

### To change the color scheme of the Default theme MONO
MONO's HTML and CSS have been significantly updated in v3.07.5.  
Therefore, if you use a CSS file older than v3.07.5, some designs will not be displayed correctly.  
For example, footers and catalogs don't look as intended.  
If you want to change only the color scheme, please use the SCSS for development.  

[css/dev/sass](https://github.com/satopian/poti-kaini-EN/tree/main/potiboard5/templates/mono_en/css/dev/sass)

It's easy to change the color scheme because the settings are separated for the color scheme and other designs.  
However, an environment that can handle SCSS is required.  
For example, the free [Visual Studio Code](https://azure.microsoft.com/en-us/products/visual-studio-code/) and its extension, [DartJS Sass Compiler and Sass Watcher](https://marketplace.visualstudio.com/items?itemName=codelios.dartsass).


### 2026/05/22 v6.179.0

### litaChix Updates
- Used TypeScript static analysis tools to identify and fix potential bugs.  
- Fixed an error that occurred when using the Blender tool on masks, where a method assuming the object was a color object was being called.  
- Removed unused memory management code that was no longer referenced anywhere.  
- Although the warning level of the TypeScript static analysis tools had been configured to be lenient, there were still thousands of warnings.  
  All of those warnings have now been reduced to zero.  
- In the template used to launch litaChix, `const handleExit = ()=>{` has been changed to `window.handleExit = ()=>{`.  
  While resolving TypeScript static analysis warnings, the `handleExit` function was moved under `window`, so assigning it to a constant defined with `const` no longer worked because it was not attached to `window`.  

### 2026/05/16 v6.178.0

### litaChix Updates
- Used TypeScript static analysis tools to identify and fix potential bugs.  
  In addition, inheritance written using `Object.create(Parent)` could not be correctly recognized by the TypeScript analysis tools, causing repeated warnings.  
  Therefore, the inheritance code was rewritten using the `extends` syntax of ES6 classes.  
  This resulted in a large-scale refactoring.  
- Changed the default opacity of the Pen tool to the maximum value of 255.  
- Changed the Pencil opacity to the maximum value of 255 and restored the default size to 16.  
- Strengthened the low-pass filter used to prevent sudden pressure changes.  
- Changed the default stabilizer value for the Pen and Pencil tools from 5% to 6%.  

### PaintBBS NEO Updates
- Used TypeScript static analysis tools to identify and fix potential bugs.  
- Rewrote inheritance using `new(Parent)` and `Object.create(Parent)` to use ES6 class `extends` syntax.  
- Added descriptions for the newly added shortcut keys in the PaintBBS NEO paint screen: Pencil: B, Eraser: E.  


### 2026/05/06 v6.176.0 
### litaChix Updates
- Increased the dilution of the watercolor brush, resulting in lighter color application.  
- The opacity slider now changes more gradually at lower values.  

### PaintBBS NEO Updates
- Added shortcut keys.  
  B: Pencil · E: Eraser · W: Watercolor · Delete|Backspace: Clear layer (executes immediately, without switching tools)  


### 2026/05/03 v6.175.0 

### litaChix Updates
- Fixed an issue where layer names could no longer be changed by double-clicking.  


### 2026/05/02 v6.173.2
### PaintBBS NEO Updates
- Since stabilization is mainly needed when the canvas is at 100% or reduced, its strength is now reduced when zoomed in.  
  Stabilization can be effective for line art but not always suitable for painting, so it is also reduced when the brush size is larger than 8.  
  When both conditions apply (zoomed in and brush size greater than 8), the stabilization effect is reduced even further.  
- Added a script to the HTML file that launches NEO to prevent unintended double-tap zoom on iPad.  

### Initialized potentially undefined variables
- Initialized variables that could potentially be undefined to resolve warnings from static analysis tools.  

### Added type annotations to function arguments
- Added type annotations to function arguments to resolve warnings from static analysis tools.  

### 2026/05/02 v6.173.2

### PaintBBS NEO Updates
- Since stabilization is mainly needed when the canvas is at 100% or reduced, its strength is now reduced when zoomed in.  
  Stabilization can be effective for line art but not always suitable for painting, so it is also reduced when the brush size is larger than 8.  
  When both conditions apply (zoomed in and brush size greater than 8), the stabilization effect is reduced even further.  
- Added a script to the HTML file that launches NEO to prevent unintended double-tap zoom on iPad.  

### Initialized potentially undefined variables
- Initialized variables that could potentially be undefined to resolve warnings from static analysis tools.  

### Added type annotations to function arguments
- Added type annotations to function arguments to resolve warnings from static analysis tools.  


### 2026/04/29 v6.172.0
### PaintBBS NEO Updates
- Fixed bugs introduced in recent updates. Fixed an issue where the line width was reset to 1px when switching between the Pencil and Watercolor tools.  
- Fixed an issue where the text input overlay remained visible even after switching to tools other than the Text tool.  
- When using "Rotat", striped artifacts could appear in areas that should be blank.  
  This behavior reproduces the original PaintBBS, but it requires extra work to remove the stripes when simply rotating.  
  Therefore, a newly added option allows disabling these stripes.  

### litaChix Updates
- There were reports of an issue where values would continue changing and could not be finalized when using the color picker or sliders, even after releasing the pen.  
  This was likely caused by the browser not correctly interpreting `touch-action: none`.  
  Since `pointermove` can be suppressed via JavaScript even in browsers where `touch-action: none` is not supported, the code has been updated as a precaution.  



### 2026/04/27 v6.171.0

### PaintBBS NEO Updates
- Fixed an issue where unintended zooming could occur due to double-tap zoom.  

### litaChix Updates
- Brush sizes below 5 can now be adjusted in 0.5 increments. Intermediate sizes such as 1.5 and 3.5 can be selected.  
  Also, the slider for brush sizes between 1 and 5 is now evenly distributed to make selection easier.  
- The default pencil size has been changed from 16 to 2, and brush size now varies with pen pressure.  
  Previously, it was set to 16px with opacity 255, making it more suitable for solid fills than a pencil.  
  You can still restore the previous settings by adjusting the values in the tool options palette.  
- The default opacity of the Pen tool has been changed to 250.  
  Based on feedback that it felt too light for a pen, it has been adjusted to a more pen-like opacity.  

### Tegaki Updates
- Added a measure to prevent double-tap zoom.  

### 2026/04/25 v6.170.1

### tegaki.js Updates  
- Fixed an issue where replay data created before the Hand tool was added could no longer be played back.  

### PaintBBS NEO Updates
- Reduced the strength of the stabilizer.  
- Unified the EventListeners for drawing and slider operations under pointer events, simplifying previously complex handling.  


### 2026/04/23 v6.169.0

### tegaki.js Updates  
- Added a Hand tool icon for mobile devices where scrolling was not possible when opening large canvases or zooming in.  
    
<img width="500" height="635" alt="image" src="https://github.com/user-attachments/assets/ba330bc4-0c8e-4576-9e4b-508adc4dcb39" /><br>

- However, since this uses the same touch scrolling behavior as scrolling with a finger on a smartphone, it does not work with a mouse.  

### PaintBBS NEO Updates
- Reduced the strength of the stabilization level.  
  
### 2026/04/22 v6.167.0
### tegaki.js Updates
- Pressing the Space key now switches to the Hand tool.  
  (Only when scrollbars are visible.)  


### 2026/04/20 v6.166.2

### PaintBBS NEO Updates
- You can now adjust the stabilization level.  
  
<img width="670" height="718" alt="Screen-2026-04-20_11-10-02" src="https://github.com/user-attachments/assets/a60e32df-f64b-4fa7-abfd-4765ffb60bd2" /><br>
  
  0 = no stabilization, 5 = maximum.  
  
- Fixed an issue where pressing the Space key would sometimes fail to switch to the Hand tool.  


### 2026/04/18 v6.165.3

### PaintBBS NEO Updates
- Added a stabilization (anti-shake) feature.  
  When drawing on large canvases such as 2000×2000 pixels in PaintBBS NEO, the zoom-out feature is often used.  
  However, drawing on a reduced canvas could record small hand movements, which would appear as significant line jitter when viewed at 100% zoom.  
  To address this, a stabilization (anti-shake) feature has been added.  
  This feature also works when drawing at 100% zoom and helps reduce the feeling of the pen slipping on the canvas.  
  While stabilization has been added, the characteristic jagged line style of PaintBBS remains unchanged.  


### PaintBBS NEO Updates
- Copy operations can now be reset using undo actions such as "Ctrl+Z" or "Undo".  

### litaChix Updates
- litaChix has a fullscreen mode, and the "Esc" key is reserved by the browser to exit fullscreen.  
  Therefore, cancel operations that previously used the "Esc" key have been moved to "Ctrl+Z" (Undo).  
  For example, canceling a Bezier curve drawing is now done with "Ctrl+Z" or the Undo button.  
  Canceling transform operations is also now done with "Ctrl+Z" or the Undo button.  
  The "Esc" key is now used exclusively for exiting fullscreen mode in the browser.  


### 2026/04/12 v6.162.0

### NEO Updates
Shi-chan’s `oekaki.html` includes the following description:

> Copy and Bezier operations can be reset with [Esc]. (Same for right-clicking)

The original PaintBBS v2.04 and v2.19 behave according to this description.  
Therefore, the following features were added to PaintBBS NEO to match this behavior:
- Added right-click reset for Bezier operations.  
- Added right-click reset for copy operations.  
- Fixed an issue (present since NEO v1.5.x) where canceling a copy operation could leave an image on the canvas with its transparency ignored, identical to the one shown while moving the copied selection.  

- Fixed an issue where confirming a selection for copying would replace the selected area with an image with its transparency ignored, identical to the one shown while moving the copied selection.  

### litaChix Updates
- Reworked the Bezier curve behavior in litaChix to make it closer to PaintBBS NEO and Shi-Painter.  
  The starting position of the second control handle is now aligned with the end position of the first segment.  
  Pressing the Escape key or right-clicking during a Bezier operation now cancels the action.  


### 2026/04/08 v6.161.0

### PaintBBS NEO Updates
- Fixed a flicker in the Bezier curve preview that briefly appeared when releasing the pen.  

### litaChix Updates
- Reduced the size of the circular cursor that displays the picked color.  
  The outer size was changed from 20px to 18px, and the inner colored area from 18px to 16px.  


### 2026/04/07 v6.160.2

### NEO Updates
- Added the "neo-" prefix to all IDs used in PaintBBS NEO.  


### NEO Updates
- Added the "-neo" prefix to IDs to avoid ID conflicts.  


### 2026/04/05 v6.159.1

### litaChix Updates
- Fixed a potential issue where menus could become unresponsive to taps on iOS.  


### 2026/04/04 v6.159.0
### litaChix Updates
- Displays the color picked with the Color picker as a circular cursor.  
      
<img width="499" height="444" alt="image" src="https://github.com/user-attachments/assets/1e6c60e3-cf46-4da7-b92e-fa2394932b03" /><br>
   

### 2026/04/01 v6.158.2

### litaChix Updates
- Fixed an issue where the error message "Whoops! This layer is currently hidden." was shown even when the Color picker source was set to "Pick displayed color".  


### 2026/04/01 v6.158.1

### litaChix Updates
- Fixed an issue where hovering over labels in the "Color picker" tool options panel did not show the clickable pointer cursor.  
- Slightly adjusted the blue color scheme.  
- Adjusted when messages such as "Whoops! This layer is currently hidden." and "Whoops! This layer's opacity is currently 0%." are displayed during transform operations.  
  Previously, these messages were shown when selecting Menu → Edit.  
- Now shows messages such as "Whoops! This layer is currently hidden." and "Whoops! This layer's opacity is currently 0%." and aborts the operation when attempting to pick colors from a hidden layer.  


### 2026/03/30 v6.157.3

### litaChix Update
- The eyedropper tool no longer samples fully transparent areas.  
  When sampling a transparent area, the previously selected color is now retained without change.  
  This behavior matches that of FireAlpaca and Krita.  
  Previously, invisible colors such as white or black within transparent areas could be picked.  

- Fixed an issue where the cursor icon did not match the active function during temporary changes via shortcut keys.  

- When repeated input from the same key is detected, only the first input is now processed.  
  For example, pressing the Tab key hides the UI, but previously holding it down caused the UI to toggle continuously.  
  Now it will toggle only once, preventing repeated execution and reducing device load.  


### 2026/03/29 v6.157.2
### litaChix Update
- Added an option to choose the sampling source for the eyedropper tool: "Pick displayed color" or "Pick color from layer"    
  Due to layer effects such as Multiply or Overlay, the displayed color may differ from the actual color on an individual layer.      
  Previously, there was no way to sample color directly from the active layer itself.    
  Similar to Clip Studio Paint and FireAlpaca, it is now possible to choose whether to pick colors from the composited (displayed) image or from the active layer.   

<img width="212" height="262" alt="image" src="https://github.com/user-attachments/assets/837768d1-ab24-4d17-a291-3021893486f3" />


### 2026/03/25 v6.156.0

- Improved the blending behavior of the Blender brush tool.  
  When stroking from transparent areas toward opaque areas, the brush now blends with transparency.  
  Dragging transparent pixels with the Blender brush makes previously opaque areas transparent.
  
<img width="967" height="730" alt="image" src="https://github.com/user-attachments/assets/4ced0808-9219-422f-a9c6-3aadb6417020" />
  

### 2026/03/23 v6.155.10
### PaintBBS NEO Updates
- You can now select reduction rates of 80%, 60%, 40%, and 20%.  
  The canvas can be reduced from 100% in 20% increments.
- Fixed a bug where the inverted color area of a rectangle remained after filling a rectangular selection with the Rectangle Tool.  
  This bug occurred in NEO v1.6.25 (2026/03/15) and was fixed in v1.6.26.


### 2026/03/22 v6.155.9
### litaChix Update
- Improved the Blender brush tool.  
  It now uses the watercolor brush blending algorithm to produce more natural color mixing.


### 2026/03/19 v6.155.8
### tegaki.js Update
- Added finer zoom level control below 1.0x, allowing values such as 0.5x, 0.6x, 0.7x, 0.8x, 0.9x, and 1.0x.
- When rewinding during playback while using zoom, the zoom level is now reset to 1.0x.
- Enabled touch-based scrolling of the canvas during playback on mobile devices.


### 2026/03/18 v6.155.7
### litaChix Update
- When a layer has 0% opacity or is hidden, a warning is now shown and the operation is canceled if a transform is attempted from the tool options panel.


### 2026/03/17 v6.155.6
### litaChix Update
- Added a "Duplicate" checkbox to the Move tool options panel.  
  When "Duplicate" is enabled, the selected content is duplicated and the copy is moved.
<img width="207" height="257" alt="image" src="https://github.com/user-attachments/assets/f2b7a5a7-4cdd-4cc6-878d-6f6da3c86a1a" />


### litaChix Update
- Fixed an issue where Ctrl+Alt with the Move tool would also trigger duplication.    
Duplication now occurs only when Alt is pressed alone.

### 2026/03/15 v6.155.3
### PaintBBS NEO Update
- Optimized the number of canvas redraws during copy and layer merge operations to reduce load.  
- Fixed an issue where these operations became very slow and difficult to use with large canvas sizes.


### 2026/03/15 v6.155.2
### litaChix Update
- Fixed an issue where autosave could trigger during a transform operation and cause the transform confirmation dialog to appear.
- Prevented high-load transform/move operations and autosave from running at the same time.  
  Autosave will no longer run while transform or move mode is active.


### 2026/03/14 v6.155.0
### PaintBBS NEO Update
- Updated NEO. Fixed an issue where scrolling became extremely slow and nearly unusable when the canvas was displayed at a reduced scale in "Float" mode.  
  This issue occurred with very large canvas sizes such as 2000x2000.  
  To resolve this, the rendering quality during scaled display was adjusted and the number of screen redraws during scrolling was optimized.  
  Scrolling is now smooth.


### 2026/03/09 v6.153.1

### litaChix Update
- Reduced the number of redraw operations during move and transform actions to lower device load.

### 2026/03/09 v6.153.0

### litaChix Update
- Reduced memory usage during save compression to avoid memory pressure during autosave on devices such as iPads.
- Cleaned up duplicated event listeners that were being called frequently during drawing.
- The Monochromatic noise filter previously generated noise using the selected color and white.  
  However, when the selected color was white, the result became completely white.  
  It now generates noise using the selected color and transparency instead.    
  This makes it possible to create white grain and similar noise effects.

### 2026/03/05 v6.152.6
### AXNOS Paint Update
- Reduced the update frequency of the layer thumbnails and the navigator thumbnail to improve drawing performance on the main canvas.


### 2026/03/02 v6.152.5

- Fixed an issue in Lightbox v2.12.0 where images could not be copied.
- Updated AXNOS Paint.
- Updated litaChix.

### 2026/02/28 v6.152.2

### Lightbox v2.12.0
- Bundled a customized version based on Lightbox v2.12.0 (released on February 28), modified again for use with this bulletin board.
- Includes fixes such as memory leak improvements.

### Elvis Operator
- After learning that the Elvis operator is even slightly faster than the ternary operator, code has been standardized to use the Elvis operator wherever possible.  
  This also improves readability and helps reduce the likelihood of bugs.

### Bug
- Due to mistakenly excluding untracked files, several required Klecks files were not pushed to GitHub.  
- As a result, Klecks may not have functioned correctly in the previous update.

### 2026/02/26 v6.152.0

- Improved the safety of microsecond calculations recorded in the log file.  
- If a calculation fails due to log file corruption or other issues, the microtime2time() function will now return 0.


### 2026/02/24 v6.151.6

### Memory Optimization
- Freed memory by unsetting arrays that were no longer needed.

### Maximum POST Size Calculation
- Fixed a potential issue in the calculation of the maximum allowed POST size based on php.ini settings.  
- Separated numeric values and strings in places where ambiguous casting to numbers was previously used, as this behavior may no longer be supported in future versions of PHP.

### 2026/02/23 v6.150.1

### litaChix Update
#### Bug Fix
- Fixed an issue where backup data stored in the browser database was unintentionally deleted when selecting "Export as PNG" or "Export as ZIP" from the File menu.  
- As a result of this issue, if the page was reloaded or navigated away from immediately after choosing "Export as PNG," work in progress could not be restored.  
- Corrected the relevant function arguments to resolve this problem.


### 2026/02/22 v6.150.0
### litaChix Update
- Previously, when using the "Convert brightness to opacity" filter, pixels were converted to either transparent or black (opaque or semi-transparent).  
- With this update, pixels are now converted to either transparent or the currently selected drawing color from the color picker.  
- For example, if you draw black line art on a white background and apply this filter, the white areas become transparent as before, while the black lines are converted to the drawing color selected in the color picker.


### 2026/02/21 v6.139.0

### litaChix Update
- Updated the UI/UX of the "Menu > Backup to browser storage" operation to use a modal interface.  
- Previously, an alert notifying that the backup had been saved could appear suddenly about 10 seconds after selecting the menu item.  
- To resolve this issue, a modal now opens immediately after the operation begins to indicate that preparation is in progress. When the process is complete, a notification is displayed to inform the user.  
- In most cases, the process finishes almost instantly. However, when the canvas size is 2000x2000 with 50 or more layers, it may take around 10 seconds to complete.  
  For this reason, users are now informed in advance that the process is in progress and may take several seconds.
  
<img width="517" height="217" alt="3" src="https://github.com/user-attachments/assets/ced7bd81-63bc-4662-9f7a-31a3916f19a9" /><br>
<img width="517" height="217" alt="4" src="https://github.com/user-attachments/assets/dd513146-7018-4ce2-aa6c-f927756a29c7" /><br>
  

### 2026/02/19 v6.138.0
### litaChix Update
- Improved the performance of the saving process.
- Added the "Convert to drawing color" filter.  
  This allows you to instantly change line colors to the currently selected color in the color picker.  
  For example, if you drew with black but want to switch the lines to a blue sketch color, this filter is useful.  
  (In practice, it changes the color of all opaque areas, not only the lines.)


### 2026/02/17 v6.137.2

### litaChix Updates
- Optimized and improved the processing speed for the non-Web Worker version.


### 2026/02/16 v6.137.1

### litaChix Updates
#### Avoidance of saving issues in certain environments
- Addressed an issue where **the Web Worker in litaChix** (added in v6.133.0) could be blocked by server settings, security software, or ad blockers, preventing users from posting.
- Switched from using **Web Worker** to an alternative fflate function to ensure smooth drawing during auto-save.


### 2026/02/15 v6.136.3

### litaChix Updates
- Fixed an issue where posting from the **File menu** was not working.
  (Posting from the floppy disk icon was still functioning correctly.)


### 2026/02/14 v6.136.2

### litaChix Updates
- Adjusted the low-pass filter for pen pressure.
- The filter is no longer applied at the start of a stroke to prevent lines from becoming too thin.


### 2026/02/12 v6.136.1

### litaChix Updates
- Adjusted the low-pass filter for pen pressure.


### 2026/02/12 v6.136.0

### litaChix Update
- Fixed an issue where pinch-zoom TouchEvents were still being listened to while drawing, causing input lag.
- Although pinch-zoom is restricted to Pan and Rotation modes, the background event processing has now been correctly disabled during drawing to ensure smooth performance.

### Fixed Emoji Validation Issue
- Fixed a bug where the Zalgo text filter introduced in v6.129.1 incorrectly blocked valid emoji characters.

### 2026/02/11 v6.135.0

### litaChix Update
- Changed the compression level for the layer data file (.chi) from 7 to 6.  
- This results in a very slight increase in file size, but reduces CPU load during compression and improves processing speed.

### Improved file deletion checks
- Fixed an issue in the function that checks whether a file exists before deleting it, where an error could still occur when attempting to delete a non-existent file.  
- Since the is_file() function caches file status, the cache is now cleared before performing the check.


### 2026/02/10 v6.133.2

### litaChix Update
- Fixed an issue where the “backup available” flag could still be saved even if saving the backup to the browser failed.
- Fixed a case where attempting to load data when no backup existed could result in a fatal error.
- Made the layer information loading process asynchronous when continuing a drawing, allowing the app to start more smoothly.


### 2026/02/09 v6.133.1
### litaChix Update
- Autosave drawing lag during compression had been resolved through faster processing and moving compression to a separate thread.  
  However, a new issue appeared where retrieving layer information caused a delay of up to 200ms.  
  The affected part of the process has now been made asynchronous to fix this problem.


### 2026/02/09 v6.133.0

### litaChix Update
- Improved autosave performance by switching the data compression library from **pako** to **fflate**.  
- This update not only increases speed, but also moves the heavy compression process into a Web Worker, separating it into another thread.  
- As a result, drawing can continue smoothly without being affected by autosave.  

Autosave interruptions had already been reduced to a minimum, but with very large canvases and many layers, there was still a slight delay noticeable enough to tell when autosave was running.  
This update fundamentally resolves autosave-related lag.


### 2026/02/08 v6.132.0

### litaChix Update
- Adjusted the autosave behavior.  
- Fixed an issue where autosave could be triggered simultaneously by both the **60-stroke** and **2-minute** conditions.  
- Autosave will now run after **60 strokes or 2 minutes** have passed since the last autosave.  
- The autosave counter and timer are reset each time autosave is performed.

### Klecks Update
- Updated Klecks.



### 2026/02/06 v6.131.1

### litaChix Update
#### Improved autosave performance to prevent drawing interruptions
- Fixed an issue where autosave could cause the pen to feel momentarily unresponsive while drawing.


### 2026/02/06 v6.131.0

### litaChix Update
#### Added an autosave feature to prevent accidental loss of drawings
- litaChix can now restore your work from an autosave backup if the browser discards the canvas due to a memory saver feature, or if you accidentally close the browser or leave the page.

- Unsaved drawing data is backed up to the browser’s local database (IndexedDB).  
  Autosave is triggered on the **first stroke after 2 minutes**, or every **60 strokes**.

- When the confirmation dialog **"Unsaved data was detected. Would you like to restore it?"** appears, tap **OK** to restore the backup.  
  Please note that if you select **Cancel**, the autosaved backup data will be deleted.

- Previously, this automatic backup feature was only available in **PaintBBS NEO** and **AXNOS Paint**.  
  With this update, all three paint tools — **PaintBBS NEO**, **AXNOS Paint**, and **litaChix** — now support automatic backup to help prevent data loss.

<img width="804" height="366" alt="image" src="https://github.com/user-attachments/assets/623ce504-6f97-4292-98b0-668bc21d538b" /><br>


### 2026/02/03 v6.130.0

### litaChix Update
#### Added a shortcut for changing brush size: CTRL + ALT + Drag
- A new shortcut, **CTRL + ALT + Drag**, has been added to change brush size.  
  This shortcut is standard in many common painting tools such as Corel Painter, CLIP STUDIO PAINT, and FireAlpaca.
- The existing shortcut keys `[` and `]` for changing brush size remain available.


### 2026/02/01 v6.129.1

### Improved line quality in litaChix
- Fixed an issue where brush size became inconsistent due to pen pressure being sampled too sensitively.  
  A low-pass filter is now applied so that brush size does not change abruptly in response to pressure.
- Wherever possible, calculations are now performed using floating-point values to prevent extreme, step-like changes caused by integer rounding of brush size.

### Zalgo-style text (Unicode combining characters) countermeasures
- To prevent layout breakage in the comment area caused by Zalgo-style text (text using Unicode combining characters), such characters have been added to the list of prohibited characters.  
  However, they can still be entered when using the administrator password.


### 2026/01/27 v6.128.3

### AXNOS Paint Update
- Fixed an issue where the customized version of AXNOS Paint, modified to match POTI-board, did not work correctly on smartphones.


### 2026/01/27 v6.128.2
### litaChix Update
- Revised the logic for greying out effect menu items when a layer group is selected or while editing a mask.  
- Effect menus that include the **"Apply to all (create merged layer)"** checkbox are now **operable** even when a layer folder is selected.


### 2026/01/26 v6.128.1
### litaChix Update
- Fixed an issue where "Mono halftone" and "Mosaic" could be clicked while a layer group was selected, even though these filters are not intended to be usable in that state.
  When a layer group is selected, these filters are now grayed out and cannot be clicked.
- In the previous fix for jittery strokes, high-precision pointer events were applied only to brushes of 16px or smaller.  
- This range has now been expanded to brushes up to 32px, enabling high-precision event handling even with larger brush sizes.
- Optimized the conditions for processing high-precision pointer events to reduce performance overhead.


### 2026/01/23 v6.128.0

### litaChix Update
<img width="870" height="966" alt="image" src="https://github.com/user-attachments/assets/494f71e1-a117-4906-bf23-a442d316f50c" /><br>

- Added the **Edge** filter, which draws an outline along the boundary between transparent and opaque areas of a layer.  
  The outline is drawn using the currently selected color in the color picker.
- Previously, **"Mono halftone"** always produced black dots. It now renders dots using the currently selected color in the color picker.
- **"Monochromatic noise"** now generates noise using the currently selected color in the color picker.
- Filters that cannot be used while editing a mask are now grayed out in the Effects menu and cannot be clicked from the start.
- Fixed an error that occurred when executing **"Clear with texture"** while editing a mask.


### 2026/01/21 v6.126.1
### Lightbox Update
- Lightbox2 contained code that was deprecated in jQuery 4, so it has been individually modified in this customized version.  
  This is **not** an official patch from the Lightbox project.


### 2026/01/21 v6.126.0
### Updates to PaintBBS NEO and litaChix
- The conditions for reducing stroke jitter when moving the pen quickly have been optimized.  
  Previously, high-precision pointer events were used only when the brush size was 10px or smaller.  
  This threshold has now been relaxed to **16px or smaller**, allowing jitter to be reduced even when drawing with larger brushes.
- High-precision pointer events were previously captured even when the cursor was floating and no drawing was occurring.  
  Since this only increased system load without any benefit, high-precision events are now acquired **only during actual drawing**.

### jQuery Update
- Updated to **jQuery 4.0.0**, the first major release in about 10 years.  
  Currently, jQuery is used only for image popup display functionality.


### 2026/01/17 v6.125.1
### PaintBBS NEO and litaChix Update
#### Fixed an issue where stroke jitter occurred when moving the pen quickly
- Fixed an issue present in both PaintBBS NEO and litaChix where strokes became jittery when the pen was moved quickly.  
- When the pen movement was fast, pointer events were insufficient, causing strokes that should be smooth curves to become angular lines.  
- This issue was resolved by adding a process to restore pointer events that were thinned out by the browser.  
- However, processing a larger number of events with thick brushes increases device load and can lead to performance issues.  
- Therefore, additional pen movement events are now captured only for brushes of **10px or less**, which are necessary to ensure line quality.  
- For brush sizes of **11px or more**, the behavior remains the same as before.

<img width="500" height="500" alt="oekaki_2026_01_17_06_44_30" src="https://github.com/user-attachments/assets/c67b09ec-1db0-4470-9cf6-5c9626578e07" /><br>
↑  
Before the fix. Curved strokes show jitter, resulting in unintended angular segments.

<img width="500" height="500" alt="oekaki_2026_01_17_06_44_20" src="https://github.com/user-attachments/assets/7ae4a500-6e9e-40bb-b10b-7df930130b83" /><br>
↑  
After the fix. Curves are rendered correctly.


### 2026/01/15 v6.123.8

### litaChix Update
- Fixed an issue where Chrome’s split view (tab tiling) could open unintentionally when long-pressing items in the color set or menu.
- This is more of a bulletin board feature update than a paint tool update, but it is now possible to load the color swatches of a previously created color set when continuing a drawing.  
  This allows color set swatches to be carried over to the “continue drawing” screen.

### Preserve JPEG Format for JPEG Attachments
- During metadata removal, uploaded images were previously converted to WebP format, but images that were originally in JPEG format are now saved as JPEG.  
 
### Minor Bug Fixes
- Fixed an issue where JPEG images with Exif rotation data could be saved in PNG format.

### 2026/01/04 v6.121.2
### Reduced the risk of publishing photos containing location data
#### More thorough removal of location information (such as data included in Exif)

- Photos taken with smartphones may contain location information (GPS data).  
  This includes photos of illustrations taken at home, not only outdoor photos.
- Previously, location information was removed only when:
  the image format was JPEG **and**
  PHP successfully detected location data,
  in which case the image was recreated using GD to strip the metadata.
- Fortunately, with default settings, most smartphone photos exceed 1024px in size,
  so location data was usually removed automatically during the image resize process.
- However, location information (GPS data included in Exif, etc.)
  can also exist in WebP and PNG images.
- If such images were resized in advance using image viewers like XnView
  to a size smaller than the board’s resize threshold,
  PHP’s resize process was not triggered,
  and the images were uploaded as-is.
- PHP cannot detect the presence of location information
  in PNG and WebP image files,
  so the location check process did not function correctly.
- Therefore, regardless of whether location data is detected,
  images are now recreated and overwritten using GD.
  This removes Exif and other location information from **all uploaded images**.
- However, GD may not function in some environments,
  so please ensure in advance that your camera settings
  and image metadata are configured to avoid publishing location information.
- Under typical rental server environments,
  images recreated by GD should always be overwritten
  and location information should not remain.
  However, since it is impossible to guarantee the absence of bugs,
  it cannot be guaranteed that location information is removed 100% of the time.  
  Please exercise sufficient caution.


### 2025/12/31 v6.120.0
### litaChix Update

<img width="880" height="848" alt="image" src="https://github.com/user-attachments/assets/4b9d55ff-e088-4aa8-8c1b-54060a894333" /><br>

- Added Color Halftone Filter and Monochrome Halftone Filter.
- The background of generated tone dots is transparent by design.
  This allows the dots to be recolored using clipping layers.
- Example workflow:
  Fill the area around a character with gray, apply a blur filter,
  convert it to dots using the Monochrome Halftone Filter,
  then apply a clipping layer to add color.
  This makes it possible to use the dots as red, blue, or other colored tones.
- When the Color Halftone Filter is applied using **"Apply to all (create merged layer)"**,
  the resulting layer is automatically set to Multiply.


### 2025/12/19 v6.118.0
### litaChix Update
- Added a Mosaic (Pixelate) filter.

<img width="1180" height="628" alt="image" src="https://github.com/user-attachments/assets/c080c93d-28a4-44d6-938d-44e06955170d" /><br>



### 2025/12/11 v6.116.1
### litaChix Update
#### Improved drawing quality for brush types other than "ROUND Hard Edge"
- Updated litaChix to improve stroke quality for all brush types **except** **ROUND Hard Edge**, which did not have this issue.  
Previously, when using brushes such as **ROUND Soft**, thin strokes could fail to draw in some areas depending on pen pressure, resulting in broken or inconsistent lines.  
There were also cases where the stroke suddenly became thicker.  
These issues have been corrected so that lines no longer break and thickness changes no longer occur abruptly.

#### Adjusted effective opacity when using the Pen tool with the opacity slider set to 255
- When using the **Pen** tool, the actual opacity was too light even when the UI slider was set to its maximum value (255).  
The opacity value shown in the UI (0–255) is not used directly in rendering.  
Internally, the brush engine applies its own scaling and conversion, meaning the internal opacity range is effectively different from the UI range.

Using the absolute internal maximum opacity would degrade anti-aliasing quality.  
Therefore, the opacity curve for the internal range of **131–255** has been adjusted so that the resulting stroke opacity matches the typical behavior of common painting tools, based on sampled color values from those applications.


### 2025/12/07 v6.115.1
### Major Bug Fix in litaChix
- In v6.115.0, the smoothing quality during zoom-out was set to “high,” but this caused a significant slowdown in drawing performance in litaChix, resulting in noticeable input lag.  
  The settings have now been reverted to the previous configuration to eliminate the drawing delay.


### 2025/12/06 v6.115.0
### litaChix Update
- Fullscreen mode has been added. Similar to fullscreen video playback, the painting screen can now be displayed in fullscreen.  
  Tap the fullscreen icon to enter fullscreen mode. Tap the icon again to exit fullscreen mode.  
  You can also exit fullscreen by pressing the ESC key.

<img width="800" height="450" alt="image" src="https://github.com/user-attachments/assets/622af6bc-9e10-4c2a-86d6-950ae8609a6f" /><br>

- Fixed an issue where the top and bottom padding of the menu bar was too large, preventing efficient use of screen space.  


### 2025/12/03 v6.113.1
### "litaChix" Update
- The SVG icon weight for “Clear,” “Fill,” “Transform,” and “Deselect” was reduced from 600 to 500, as the icons were previously too bold.  
- The top palette toggle button and the “Clear,” “Fill,” “Transform,” and “Deselect” icons are now consistently aligned to the right.
   
<img width="965" height="808" alt="image" src="https://github.com/user-attachments/assets/18321ffb-fc89-4b3c-8cbe-ea00d78f5cbe" />
  

### 2025/12/02 v6.113.0
### Major Update for "litaChix"
- It is now easier to see when a selection is active.  
  Previously, even if a selection was active, only a dashed outline was displayed.  
  Very small selections could cause issues such as "cannot fill" or "cannot draw."

<img width="677" height="719" alt="image" src="https://github.com/user-attachments/assets/b97f547a-d2bc-4f2e-9652-19630f919d52" /><br>

- To address this, the area outside the selection is now shaded with a semi-transparent gray to clearly indicate that drawing is not allowed there.  
  When a selection is active, the "Deselect Icon" is displayed in blue, and the "Deselect Button" has a blue border.  
  This makes it easy to visually confirm when a selection is active.

- "Clear," "Fill," "Transform," and "Deselect" icons have been added to the top bar.

<img width="163" height="71" alt="image" src="https://github.com/user-attachments/assets/20f7ebe6-8816-4526-8773-71a52c5fb0c6" /><br>

  This allows frequently used actions to be performed quickly.  
  These are auxiliary UI elements that are not displayed on small-screen devices such as smartphones.

### Updated Files
- axnos/  Overwritten and updated directory  
- chickenpaint/  Overwritten and updated directory  
- potiboard.php

### 2025/11/28 v6.112.2
### "litaChit" has been renamed to "litaChix"
- Although it has only been a week since the renaming from "ChickenPaint Be," it has already been renamed to "Chix" (a stylized plural form of "chick").  
- The naming follows this progression: "Chicken" → "Chicks" → and then stylized as "Chix."

### Zoom-out support added in PaintBBS NEO
- Previously, pressing the "-" (minus) button would not allow zooming below 1×. With this update, users can now zoom out to 0.5× and 0.2×.  
- This makes it possible to work on extremely large canvases and allows viewing the entire canvas on small screens, such as smartphones.

### Video playback controls in PaintBBS NEO now appear at the top
- When playing very large videos or on small screens, the playback controls are now displayed at the top instead of the bottom.  
- The controls are only moved to the top if the browser's viewport height is insufficient.  
- This enables easier zooming out with the "-" button and rewinding during playback of large videos.

<img width="365" height="265" alt="image" src="https://github.com/user-attachments/assets/2d31271b-e3b1-4146-bf56-1272f56dba7e" /><br>
  

### 2025/11/20 v6.111.2
### "ChickenPaint Be" Renamed to "litaChit"
- The modified version of ChickenPaint by satopian, formerly known as "ChickenPaint Be," has been renamed to "litaChit."
- Some configuration variables still use the name "chickenpaint," and the main file remains "chickenpaint.js," maintaining high compatibility with the original ChickenPaint.
- Only the brand name has changed.
- "litaChit" is a coined term combining "lita" (Swedish for "small") and "Chit" (slip, note, or piece of paper).

- With this update, the behavior when downloading images from the file menu has changed. Previously, PNG images, the native CHI format, and color swatches in ACO format were downloaded consecutively. Now, you can either save only the image or save all items together as a ZIP file.
  
<img width="363" height="197" alt="image" src="https://github.com/user-attachments/assets/7a6b2952-f200-4e60-b096-b1902ac9ccac" /><br>
  

### 2025/11/03 v6.107.0
### Klecks Update
- Updated Klecks to the latest version.  
The selection tool now allows direct transform operations.  

### 2025/10/31 v6.105.0
### Preview Attached Images Before Posting
- When selecting an image file, the selected image is now displayed as a preview.  

<img width="596" height="538" alt="image" src="https://github.com/user-attachments/assets/4f7c0d99-2574-419e-a10e-b7bdd8a23c01" /><br>

This allows users to clearly see which image has been selected before submitting a post.  

### Update Related to Twitter Domain Change
- Updated internal references from “twitter.com” to “x.com.”  
Although “twitter.com” was redirecting to “x.com,” the service is now being unified under “x.com.”  
If the old domain remains in internal processing, the “Share on SNS” feature will no longer be able to share posts to X.  


### 2025/10/22 v6.102.1  
### ChickenPaint Be Update
- Fixed an issue where the confirm transform dialog sometimes failed to close when the button was pressed.  
- When in canvas rotation mode, the cursor now displays as "grab," the same as the hand tool.  


### 2025/10/19 v6.102.0  
### ChickenPaint Be Update  
### Mobile mode and PC mode can now be switched with a toggle button

- Previously, mobile mode was only enabled when both the screen size was small and multi-touch input was detected.  
  However, there are times when users want to maximize the drawing area even while working on a PC.  
  To address this, pressing the Mobile Mode button now switches to mobile mode even when working on a PC.  
- Additionally, on tablet devices and similar environments, when the application launched in mobile mode, it could only be used in that mode. Now, users can switch to PC mode as well.  
- The Mobile Mode and PC Mode buttons replace each other each time they are pressed.

![2025_10_13_001_ChickenPaint_Be_Mode_Switch](https://github.com/user-attachments/assets/447b580e-f2fb-4315-8891-1af01d356626)

### Fixed an Issue Preventing Posts from Shi-Painter Launched via Java Applet in Pale Moon

A problem was fixed where posting failed when using Shi-Painter with the Oracle Java plugin on Pale Moon (a browser that supports Java plugins, e.g., from The Pale Moon Project).  
The cause was a misinterpretation of how data is sent from Java.

Posting from Shi-Painter launched with Chrome + CheerpJ had no issues, because in that case the data was transmitted as JavaScript.


### 2025/10/13 v6.101.5
### ChickenPaint Be Bug Fixes
Following reports that the layer palette in ChickenPaint could not be resized, an investigation identified the following issues:

- Misaligned coordinates
- On smartphones, tablets, and Windows Ink devices, touch-move events were conflicting with pen input, causing event cancellation

These two issues have been fixed, allowing users to resize the layer palette (shrink and expand) without problems.

![Layer palette resizing in ChickenPaint Be](https://github.com/user-attachments/assets/f05d46ff-9364-4225-b424-4a7e2803df05)


### 2025/10/11 v6.101.3
#### PaintBBS NEO Update
- Fixed an issue where the application malfunctioned when a domain name contained the domain name of a specific site.


### 2025/10/07 v6.101.2
### ChickenPaint Be Update
#### Improved Chromatic Aberration Filter Behavior
<img width="507" height="270" alt="image" src="https://github.com/user-attachments/assets/e4e3a82b-6a93-42b1-8d71-80674edbd691" /><br>
- To make it clearer that a **merged layer** will be automatically added, the checkbox label has been changed to **Apply to all (create merged layer)**.  
- In the previous version, the label was **Current layer only**, but with this update, the meaning of the checkbox has been reversed.


### 2025/10/06 v6.101.1
### ChickenPaint Be Update
#### Improved Chromatic Aberration Filter Behavior
<img width="509" height="269" alt="image" src="https://github.com/user-attachments/assets/b576b207-be09-44f5-99ef-8628348c8d9b" /><br>
- Checking **Current layer only** makes the filter behave the same as in v6.101.0.  
  When unchecked, **Add merged layer** is automatically performed: a merged layer of all visible layers is added, and the Chromatic Aberration filter is applied to that merged layer.  
  Previously, you had to manually choose **Add merged layer** or **Merge all layers** in most cases.  
  This process is now automated.


### 2025/10/04 v6.101.0
### ChickenPaint Be Update
#### Added Chromatic Aberration (RGB Offset) Filter
- Implemented a **Chromatic Aberration (RGB Offset)** filter.
- Since the effect does not offset colors on transparent areas, you will need to **Merge All Layers** or use **Add Merged Layer** to combine all visible layers before applying the filter.

##### Example
<img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/ec766e06-e037-4c8b-98a8-b51aa17e66ce" />


### 2025/09/25 v6.100.1
- A problem was found with ChickenPaint Be's "Pick up underlying" (blend with layers below) feature, so its behavior has been reverted to the previous "Sample all layers" (blend all layers) functionality.


### 2025/09/24 v6.99.1
### ChickenPaint Be Update
#### Renamed "Sample all layers" to "Pick up underlying" and updated its behavior
- The behavior of the "Sample all layers" checkbox in the layer palette has been changed and the label has been updated to "Pick up underlying".  
  Previously, checking "Sample all layers" would mix colors from a merged image of all layers.  
  However, when the line art was black, using this function would also mix the black lines into the painting.  
  As a result, it was effectively unusable for coloring line art.  

- The new "Pick up underlying" feature limits color sampling to the current layer and the layers below it, excluding layers above the current layer from mixing.  
  By not picking up colors from layers above, it works correctly when coloring line art.  
  For example, if you want to paint only the blush on a face on a layer above but blend it naturally with the skin color on the layer below, this option is effective.  
  This option is only active when using mixing brushes, such as watercolor brushes or the smudge tool, that blend colors while painting.  

<img width="241" height="382" alt="image" src="https://github.com/user-attachments/assets/7f5b51ec-564c-49de-baf3-33a9dd10ec29" />


### 2025/09/22 v6.98.1
### ChickenPaint Be Update

- Improved the opacity adjustment slider.  
  Previously, when using the watercolor brush, opacity levels 1–7 produced no visible paint, and color only started appearing at level 8.  
  This has been remapped so that paint is visible starting from opacity level 1.  
  In addition, the slider response at lower opacity levels has been made more gradual, allowing finer control when working with low opacity settings.  


### 2025/09/20 v6.98.0
### ChickenPaint Be Update
#### Fixed Watercolor Brush White/Black Artifacts
- Transparent areas no longer mix with hidden white or black pixels.

- Previously, when using the watercolor brush, unintended white could surface and appear visible, or black could surface and make colors unnaturally darker.  
  This happened because seemingly transparent regions in a layer actually contained white or black pixels, which would blend when using mixing brushes.  
  As a result, when clipping to a lower layer and painting with the watercolor brush, unintended white could surface.  
  To fix this, blending is now skipped in transparent regions, and only the selected brush color is applied.  

- Blending behavior in opaque areas remains unchanged.  

#### Paint Only Within Selection
- When a selection is active, brush strokes are now restricted to within the selection area.  
  Previously, brush strokes would apply across the entire canvas regardless of selection.  


### 2025/09/18 v6.97.0

### ChickenPaint Be Update
- Fixed a bug where **grayscale Flood Fill** did not work correctly when applied to a mask.  

### Same-Origin Check with `$_SERVER['HTTP_SEC_FETCH_SITE']`
- Previously, the origin and host name were compared, and a mismatch would result in a same-origin check error.  
  However, this caused cases where legitimate users were rejected.  
  To address this, when `$_SERVER['HTTP_SEC_FETCH_SITE']` returns `same-site`, the same-origin check will now be allowed to pass.  
  [Sec-Fetch-Site header - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)  


### 2025/09/17 v6.96.6
#### Flood Fill Improvements
- In ChickenPaint Be, flood fill can now reference other layers.  
  You can separate the line art layer and the fill layer.  
  Previously, filling areas was limited to the same layer, but with **Sample All Layers** checked, the fill area is determined using a merged image of all layers.
- Added **Grow Fill Area** to allow filling anti-aliased edges.
- Flood fill opacity can now be adjusted.
- Semi-transparent colors can now be used with flood fill.

#### Additional Fix (v6.96.6)
- Fixed a bug where the **Flood Fill** opacity setting was not applied to **Grow Fill Area**.  

<img width="209" height="260" alt="image" src="https://github.com/user-attachments/assets/e31ea61e-ec3f-40f1-82ef-8e53728ae852" />


### 2025/09/16 v6.96.3
### ChickenPaint Be Update
#### Texture Fill
- When a texture is selected, you can now fill the selection area with that texture.  

https://github.com/user-attachments/assets/ddf63802-8a32-4acf-92b2-8fcab09503c9  

- Added **Clear with Texture** to the "Effects" menu, allowing you to erase using the selected texture.  

#### Bug Fixes
- Recently, it became possible to move layers using the arrow keys (← ↓ ↑ →).  
  However, when entering values in the blur adjustment modal, layers could unintentionally move.  
  This has been fixed by disabling arrow key movement while a modal is open.  


### 2025/09/11 v6.96.0
### ChickenPaint Be Update
- Added texture scaling support.  
  (You can now adjust the scale with a slider.)

https://github.com/user-attachments/assets/0e619262-2e24-49db-8882-dccf7fcb48bb

### Related Videos
- [ChickenPaint Be New Feature: Flip Horizontal Display - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  
- [ChickenPaint Be New Feature: Improved Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)  
- [ChickenPaint Be New Feature: Selection Panel & Zoom/Rotate Panel - YouTube](https://www.youtube.com/watch?v=0fipzBPHCRk)  


### 2025/09/09 v6.95.2
### ChickenPaint Be Update
- Added support for multibyte characters in ChickenPaint Be layer names.  
Previously, entering non-alphanumeric characters would cause text corruption when resuming work.  
Now, layer names fully support multiple languages and even emojis.  
  
<img width="242" height="382" alt="image" src="https://github.com/user-attachments/assets/d9074fe7-08d5-4828-87db-47cc9ec077ee" /><br>

### Improved "Copy the poster name" Feature
- Improved the "Copy the poster name" feature so that HTML special characters, which were previously converted into full-width characters, are now safely copied into the comment field as half-width characters.


### 2025/09/07 v6.93.2
### Tested with PHP 8.5 Beta 2
- Verified compatibility with the upcoming PHP 8.5 (scheduled for release in November).  
No errors or warnings occurred during testing.  

### Reduced Wait Time from 1.2s to 0.8s
- Reduced the wait time before buttons become clickable from 1.2 seconds to 0.8 seconds.  
This wait was originally introduced as a bot prevention measure, but at 1.2 seconds even human users frequently encountered the “Please wait” error message.  
The shorter 0.8s delay solves this issue while maintaining bot protection.  

### Fixed Space Characters Displaying as `+` in SNS Sharing
- Fixed an issue where sharing to SNS (e.g., Threads on mobile) converted spaces into the `+` character.  
The URL encoding process has been updated so that spaces are no longer converted into `+`.  


### 2025/09/02 v6.92.5
### ChickenPaint Be Update
#### Bug Fixes
- Fixed an issue where the brightness/contrast sliders for textures were not working correctly.  

<img width="535" height="233" alt="image" src="https://github.com/user-attachments/assets/76e36f3b-ca55-4a54-a0aa-b139d68dd753" />


### Related Videos
- [ChickenPaint Be New Feature: Flip Horizontal Display - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  
- [ChickenPaint Be New Feature: Improved Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)  
- [ChickenPaint Be New Feature: Selection Panel & Zoom/Rotate Panel - YouTube](https://www.youtube.com/watch?v=0fipzBPHCRk)  


### 2025/09/02 v6.92.2
### ChickenPaint Be Update
- Added icons to the buttons in the Tool Options palette.  
- Adjusted the background color of the Light button to match the gray used for inactive layers.  

<img width="211" height="259" alt="image" src="https://github.com/user-attachments/assets/7e07c1c6-40d8-4900-ac09-da6a4fe4e2e3" />

### Related Videos
- [ChickenPaint Be New Feature: Flip Horizontal Display - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  
- [ChickenPaint Be New Feature: Improved Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)  
- [ChickenPaint Be New Feature: Selection Panel & Zoom/Rotate Panel - YouTube](https://www.youtube.com/watch?v=0fipzBPHCRk)  


### 2025/08/29 v6.92.1
### ChickenPaint Be Update
- Fixed an issue where setting the rotation angle slider to 180 degrees caused the canvas angle to alternate between +180° and -180°, resulting in flickering.  

<img width="214" height="262" alt="image" src="https://github.com/user-attachments/assets/ee4a9d29-a99b-442f-a1c7-de5c87b36de4" />


### 2025/08/24 v6.90.3
### ChickenPaint Be Update
- Adjusted button colors.  

<img width="461" height="391" alt="image" src="https://github.com/user-attachments/assets/5cf045bf-8eb1-4c32-9857-f7f5776c81e4" />


### 2025/08/20 v6.90.0
- Changed the conditions for clearing GPS information.  
  Previously, GPS data was cleared only if **both latitude and longitude were present**.  
  Now, GPS data will be cleared if **either latitude or longitude is present**.  
  Normally, GPS data with only latitude or only longitude should not exist, but this change ensures that such incomplete data is also removed in case of corruption.


### 2025/08/20 v6.89.5
### ChickenPaint Be Update
#### Added "Zoom and Rotate" to the Tool Options Palette
- The "Zoom and Rotate" panel has been added to the Tool Options Palette.
  It is displayed when using the Hand Tool, Rotate Tool, or when pressing the Space key.
- You can adjust zoom and canvas rotation using the sliders.
- Pressing the "Reset View" button resets all of the following: **Zoom**, **Rotation**, and **Flip View Horizontally**.

<img width="208" height="259" alt="image" src="https://github.com/user-attachments/assets/2f50e80f-0758-4280-be71-39368261110c" /><br>

[ChickenPaint Be New Feature: Flip View Horizontally - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)


### 2025/08/17 v6.88.3
### ChickenPaint Be Update
- When using the selection tool, a **Constrain** checkbox is now displayed.
- The **Transform** button is now highlighted in blue.
- Pressing the **Enter** key applies the transformation.

<img width="211" height="261" alt="image" src="https://github.com/user-attachments/assets/b33fa63c-3b74-4972-bbf5-b3ae0014074c" /><br>

[ChickenPaint Be New Feature: Flip View Horizontally - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)

### 2025/08/16 v6.88.2
### ChickenPaint Be Update
- A "Constrain Proportions" checkbox is now displayed during transform operations.  

<img width="219" height="267" alt="image" src="https://github.com/user-attachments/assets/ebf4c33e-16cc-4d1e-ad6f-40a27813fbd8" /><br>

[ChickenPaint Be New Feature: Flip View Horizontally - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)

### 2025/08/16 v6.88.1
### ChickenPaint Be Update
#### Workflow Improvements
- When using the Rectangular Selection Tool or the Move Tool, the Tool Options palette now displays **Select All**, **Deselect**, and **Transform** buttons.

<img width="411" height="312" alt="image" src="https://github.com/user-attachments/assets/88bf8d10-387e-4f51-87cf-784dc415dcb7" />


### 2025/08/14 v6.87.1
### ChickenPaint Be Update
- Fixed a bug where, when performing a transformation while the view was flipped horizontally, the rotation direction of the object was opposite to the pen’s rotation direction.
- Fixed a bug where, when the view was flipped horizontally, moving the object with the ← ↓ ↑ → arrow keys caused left and right movements to be reversed.

[ChickenPaint Be New Feature: Flip View Horizontally - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)


### 2025/08/13 v6.87.0
### ChickenPaint Be Update
#### Added "Flip View Horizontally" Feature for Dramatically Improved Workflow
- Updated ChickenPaint Be.  
- Previously, flipping the entire image horizontally required flipping each layer one by one.  
  For example, with 50 layers, you had to flip all 50 layers individually.  
- The newly added **"Flip View Horizontally"** feature flips the display of all layers at once.  
- Since this is a *view-only* flip, it does not alter the actual image and is not recorded in the undo history.  
- When the flip button has a red border, the view is in flipped state.  
- Be careful not to mistake the flipped view as the correct orientation, as this could lead to posting a flipped image.  

- This newly added "Flip View Horizontally" feature is commonly used in many painting tools.  

[ChickenPaint Be New Feature: Flip View Horizontally - YouTube](https://www.youtube.com/watch?v=ATRIBAJKq5c)  

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)



### 2025/08/10 v6.86.7
### Fixed Bugs in ChickenPaint Be
- Fixed an issue where, during a transform operation, pressing the space key to enter temporary pan mode (move canvas) caused the cursor to flicker by switching back and forth every time the pen or mouse was moved.  

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)


### 2025/08/09 v6.86.6
### Fixed Bugs in ChickenPaint Be
- Fixed an issue where, after entering zoom mode with [CTRL + Space] and dragging the pen left or right, the cursor would incorrectly switch to the pan (move canvas) cursor even while zooming.  
  This was less noticeable in Chrome, where the cursor disappears while pressing with the pen, but in Firefox, Edge, or when using a mouse, the cursor remained visible and did not match the active mode.  
- Fixed a flickering issue when the Move Tool was selected, and space was pressed to enter pan mode: moving the pen caused the cursor to alternate rapidly between the Move Tool cursor and the Pan cursor.  
- Fixed an issue where, after entering zoom mode with [CTRL + Space] and releasing the CTRL key, the cursor did not revert to the pan-enabled cursor but instead stayed as the "panning in progress" cursor.  
- Fixed an issue where the Selection Tool would stop working after entering zoom mode with [CTRL + Space].


### 2025/08/07 v6.86.5
### Added Alternative Shortcut Key for Zooming with Pen Drag
- In v6.86.0, we introduced a zoom feature that allows you to zoom in and out by dragging the pen left or right while holding down [CTRL + Space].  
However, on macOS, this shortcut is already used by the operating system, making it unavailable for use in the app.  
To address this, we’ve added an alternative shortcut that enters zoom mode when pressing the [Z] key.

- Dragging the pen left or right while holding [Z] will zoom in or out.  
- The existing [CTRL + Space] shortcut still works for the same purpose.

[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)


### 2025/08/06 v6.86.3
### ChickenPaint Be Update
- Prevented the menu from opening when pressing the ↓ key during a transformation operation.  
Previously, when entering transform mode via Menu → Edit → Transform, the menu remained focused, causing the ↓ key to open the menu.  
This update removes the focus from the menu bar when entering transform mode, allowing the ↓ key to be used for moving the selected area during transformation.  
  
[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)  
  


### 2025/08/05 v6.86.1

### ChickenPaint Be Update
- When the Move tool is selected or during a transformation operation, you can now move the selected area using the arrow keys (← ↓ ↑ →).  
This allows for movement in 1-pixel increments.  
  
[New Features in ChickenPaint Be: Enhanced Zoom and Move - YouTube](https://www.youtube.com/watch?v=PPjAfSb5IYA)  
  

### 2025/08/02 v6.86.0

### Enhanced Zoom Features in ChickenPaint Be

- Two new continuous zoom features have been added: pinch-to-zoom and zooming via horizontal pen drag.
- Previously, users could only zoom incrementally using magnifying glass icons (e.g., 1.5x, 0.75x) or continuously via mouse wheel.
- Since mobile devices like iPads and smartphones do not support mouse wheels, continuous zooming was not available.
- With the implementation of pinch-to-zoom, users on mobile devices can now smoothly zoom in and out.

#### Pinch-to-Zoom Implemented
- When the selected tool is "hand" (canvas move) or "rotate", pinch-to-zoom can now be used on touch devices.
  
[ChickenPaint Be: Pinch-to-Zoom Demo - YouTube](https://www.youtube.com/shorts/Vj1nf5S9JVA)

#### Zoom with Horizontal Pen Drag
- While holding down `CTRL + SPACE`, you can enter zoom mode.
- In zoom mode, dragging left zooms out, and dragging right zooms in. The cursor also changes to indicate zoom mode.
  
[ChickenPaint Be: Zoom with Pen Drag Demo - YouTube](https://www.youtube.com/shorts/s8PsKRhqb-Y)

### BladeOne Updated

- Updated the BladeOne template engine to version v4.19.


### 2025/07/08 v6.85.0

### PHP 8.5 Compatibility Improvements

- Updated functions and syntax that may be deprecated according to the [PHP RFC for deprecations in PHP 8.5](https://wiki.php.net/rfc/deprecations_php_8_5).  
  (As of now, these deprecations are still under discussion.)

> Deprecate no-op functions from the resource to object conversion:  
> Deprecate `imagedestroy()`

- These functions became no-ops in PHP 8.0.  
  Code was refactored to conditionally support both PHP 7 and PHP 8.5 by branching logic based on the PHP version.

> Language/syntax deprecations:  
> Deprecate semicolon after `case` in `switch` statement

- Unified `switch` statement syntax by replacing semicolons after `case` with colons.


### 2025/07/01 v6.82.0

### ChickenPaint Be Update

- Added a new layer operation menu item to create a merged layer while preserving existing layers.  
  Previously, using “Merge All Layers” would flatten all layers into one.  
  The newly added “Add Merged Layer” option creates a new merged layer while keeping all original layers intact.  
  This is equivalent to the “Merge visible to new layer” feature in Clip Studio Paint.  
  See:[CLIP STUDIO PAINT Instruction manual - Merge visible to new layer](https://www.clip-studio.com/site/gd_en/csp/userguide/csp_userguide/500_menu/500_menu_layer_merging_copy.htm#:~:text=Select%20%5BLayer%5D%20menu%20)

#### How to Use
Menu > Layers > Add Merged Layer  
or use the shortcut key: `Shift + Alt + E`


### 2025/06/29 v6.81.3

### Bug Fix

- Fixed an issue where parsing old log entries (from POTI-board versions prior to v6) with `explode()` caused undefined array keys due to **insufficient delimiters**.  
  This bug was introduced in **v6.80.8** and fixed in **v6.81.3**.

### 2025/06/25 v6.81.2

### Dropped Support for All Versions of Internet Explorer, Including Edge IE Mode

- Due to continued JavaScript updates, it was discovered that posting from Internet Explorer (IE) had become impossible.  
  While we considered reverting some code to older syntax to restore compatibility,  
  using outdated browsers poses significant security risks.  

- Shi-Painter now works with Chrome and CheerpJ, even allowing usage on iPhone.  
  In addition, browsers like [The Pale Moon Project homepage](https://www.palemoon.org/)  
  still support Java applets with Java plugins, offering alternatives for users.

- As a result, official support for all versions of Internet Explorer, including IE mode in Edge, has been discontinued.  

- This change also allows stricter enforcement of Same-Origin Policy checks,  
  which were previously limited to maintain IE compatibility.


### 2025/06/10 v6.80.1
### No Drawing Time or Step Restrictions When Uploading PCH from Admin Panel

- Previously, when the following settings were configured in `config.php`:
  
  ```php
  define("SECURITY_CLICK", "60");  
  define("SECURITY_TIMER", "60");
  ```

  an alert would appear when trying to post a drawing from the admin panel using an uploaded paint file.  
  For example: “Please draw more” or “Please draw for another 60 sec”  
  However, this behavior is not appropriate when administrators upload legacy artworks.

- When uploading `.pch` files (PaintBBS NEO), `.chi` files (ChickenPaint), or `.psd` files (Klecks) from the admin panel,  
  it's often for reposting previous works.  
  In these cases, alerts such as “Please draw more” or “Please draw for another 60 sec” were unnecessary and inconvenient.

![20250610_PCHアップロードペイントの時は描画時間の制限を受けない英語版](https://github.com/user-attachments/assets/72e0e54c-44be-4836-aff0-ebcb9d2fad01)

- **With this update**, alerts for short drawing time or low step count are disabled when uploading drawing files via the admin panel.  
  Regardless of the `SECURITY_CLICK` or `SECURITY_TIMER` settings, uploads will now proceed immediately after loading the canvas.


### POTI-board EVO  Release  
### 2025/06/09 v6.79.2
### Fixed Bug in Retrieving Values from php.ini

- Fixed a bug where the value of  
  [`post_max_size`](https://www.php.net/manual/en/ini.core.php#ini.post-max-size)  
  from `php.ini` was not properly recognized.  
  Previously, all values were treated as megabytes (MB), regardless of the unit.  
  For example, `100KB` was incorrectly interpreted as `100MB`.  
  With this fix, `100MB` is interpreted correctly as `100MB`, and `100KB` is interpreted as `0.09765625MB`.  
  Because of this, JavaScript on the paint screen now calculates values including decimal points.

- Fixed an issue where PaintBBS NEO would discard animations and Klecks would fail to post  
  when the value could not be retrieved from `php.ini`.  
  Previously, if retrieval failed, a value of `0` would be returned and compared against the file size,  
  causing uploads to fail.  
  With this fix, if the retrieved value is `0`, it is treated as if no limit was found, and posting is allowed.

- Fixed a PHP error that occurred when users submitted image files that exceeded the limit set in `php.ini`.  
  JavaScript has been updated to check file sizes on the front end.  
  The upper limit defined in the `MAX_FILE_SIZE` hidden input is now read and used by JavaScript to validate the upload.  
  This prevents excessive file sizes like `100MB` from being passed to PHP and causing an error.  
  Of course, file size validation is also performed on the backend using PHP.


### 2025/05/29 v6.77.0
### Added Option to Reject Posts from Devices with JavaScript Disabled

- Introduced a mechanism to handle posts via JavaScript.  
  A flag indicating that the post was made via JavaScript is now added,  
  and posts without this flag can be rejected.  
  This helps block basic spam bots that cannot process JavaScript.

- Added a new configuration option to `config.php`  
  that allows the admin to choose whether to reject non-JavaScript submissions.  
  Enforcing JavaScript-only posts may cause issues with older templates  
  that do not include the updated JavaScript.

- If the new setting is not present in `config.php`,  
  both JavaScript and non-JavaScript posts will be accepted by default.

To enable JavaScript-only posting, add the following setting anywhere in `config.php`:

- Also added a script in JavaScript to reject posts from browser automation bots.

### 2025/05/26 v6.76.3
### Enhanced Bot Protection
- Measures the time between form display and submit button press. If it's too short, the submission is rejected.  
- In recent versions, checks were added to block unauthorized posts by verifying if cookies are enabled and ensuring same-origin policies are respected.     
- While these measures cannot fully prevent spam or brute-force attacks, they are considered effective against bots that attempt to post directly to form fields without using a browser.

### Migrated from Deprecated X-Frame-Options to CSP
The now-deprecated [X-Frame-Options - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) header (deprecated in December 2024) has been replaced with [Content-Security-Policy (CSP) - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy).  
This is a necessary feature for preventing clickjacking.  
However, since some users still want to allow the site to be displayed in a frame, the setting can be configured in `config.php` to either allow or disallow framing.  
For more information on clickjacking, refer to:  
[Clickjacking prevention - Security on the web | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Clickjacking)
By default, embedding the site in a frame is disallowed to avoid clickjacking vulnerabilities that can occur when such embedding is permitted.

### 2025/04/12 v6.73.2
### Made the PaintBBS NEO's Viewer Compatible with Smartphones and Tablets  
- The timelapse playback controls in PaintBBS NEO’s viewer have been updated for smartphone, tablet, and pen tablet (with Windows Ink enabled) compatibility.  
- Previously optimized for mouse control, the animetion progress bar now allows playback pause and rewind actions to be performed on touch devices as well.  
- Image scrolling while zoomed in on the animetion player was originally optimized for mouse use but has now been adapted for touch devices, making it possible to operate on smartphones and tablets.  

![Smartphone-Compatible Viewer Controls](https://github.com/user-attachments/assets/001e4a2d-cde4-4349-aa2d-adb9011990a9)

### 2025/04/09 v6.73.0

### Gradual Reduction of jQuery Usage  
- jQuery in ChickenPaint Be has been completely replaced with JavaScript.  
However, the "Back to top" link that appears when scrolling was still using jQuery.  
This "Back to top" link has now been replaced with JavaScript.  
As a result, the only remaining usage of jQuery is for the Lightbox2 image popup display.  
Even if jQuery development were to be discontinued, alternative solutions for image popups are available.


For those who have customized CSS, please add the following to any part of the CSS file:  
```
#page_top {
 visibility: hidden;
}
```
Alternatively, while it's not required, without this change, the "Back to top" button may briefly appear when the board is displayed.

### 2025/04/07 v6.72.3
### Refactored JavaScript for Submission Handling  
- Streamlined the flow of form data submission processing.  
- Replaced jQuery-based re-enabling of disabled buttons with vanilla JavaScript.

### Refactored Dynamic Palette Script  
- Removed legacy code that is no longer recommended in modern browsers (as of 2025).


### 2025/04/05 v6.72.2
### Removed jQuery Dependency
- All remaining jQuery usage in ChickenPaint has been completely replaced with vanilla JavaScript.  
The `chickenpaint.js` file size has been reduced to just **501 KB**.  
By removing the dependency on jQuery, ChickenPaint is now fully independent of future jQuery development.  
Even if jQuery development ends, **ChickenPaint will remain unaffected**.


## 2025/04/02 v6.72.1  
### Bug Fixes  
- Fixed a minor error that occurred during the playback of PaintBBS NEO's drawing process.  
  - This bug was introduced in **v1.6.15**, but it only caused an error message in the console and did not affect functionality.  
"The content has been updated, but the version number remains **v1.6.15**.
### Gradual Reduction of jQuery in ChickenPaint  
- We are gradually reducing the use of jQuery in ChickenPaint.  
  - While it's unclear how much we can eliminate, we are replacing jQuery with JavaScript wherever possible.  


## 2025/03/31 v6.72.0
### Bug Fixes
- A bug was found in `loadcookie.js`.
- A bug was found where **Cookies overwrites the paint tool that should be launched** when application-specific files for **Klecks, NEO, ChickenPaint** are present and the tool selection menu is not visible. Instead of the correct tool, the previously used paint tool is launched.
- This issue was introduced in **v6.68.3 (2025/03/10)** and fixed in **v6.72.0**.
- As part of the fix, a **version number query parameter** was added to all places where `loadcookie.js` is used. However, updating all the necessary templates is overkill. Instead, **update `loadcookie.js` and do a hard reload in your browser**.

**AXNOS Paint, Klecks, Tegaki** templates have also been updated to improve error messages for communication failures, but **you don't need to update all templates**. So at least update **`loadcookie.js`**.


## 2025/03/30 v6.71.1

### ChickenPaint Be Update
- Layer masks can now be deleted using the trash icon in the layer palette.  
Previously, tapping the trash icon would delete the entire layer.  
Until now, deleting a layer mask required selecting **Menu → Layer → Delete Layer Mask**.  

![レイヤーマスクをゴミ箱アイコンで削除en](https://github.com/user-attachments/assets/588c1ef3-a242-4390-8c5f-1488afa129be)

- Fixed an issue where undeclared variables were mixed in.  
- Corrected incorrect function arguments.  
- Improved error messages for communication failures.  

![image](https://github.com/user-attachments/assets/367b68a4-d0e9-4427-9d32-4363464bf054)


## 2025/03/27 v6.71.0

### Preparation for PHP 8.5 Support
### Created a Wrapper Function to Handle Mandatory flock() Return Value Check
> [PHP: rfc:marking_return_value_as_important](https://wiki.php.net/rfc/marking_return_value_as_important)

- In PHP 8.5, scheduled for release in Fall 2025, checking the return value of `flock()` will become mandatory. A wrapper function has been created to ensure that file lock failures result in an error.  
- When "Continue Drawing" → "Replace Image" fails to acquire a file lock, it will switch to a new post instead, preventing the loss of illustrations.  


## 2025/03/26 v6.70.2

### PaintBBS NEO Update
- Fixed a potential malfunction that could occur when a specific site's hostname was included in the host name.  
- This issue was resolved by verifying that the domain name and subdomain match the intended site.

### Refactoring of Regular Expressions
- Consolidated multiple similar regular expressions into a single line.

### Minimizing explode() Splitting
- Added a third argument (`limit`) to restrict splitting to just two parts where applicable. Previously, the process split based on the number of commas, even when only two splits were needed.

## 2025/03/22 v6.69.0  
### PaintBBS v1.6.15  
- Updated PaintBBS NEO. Now it displays more detailed error messages.  
![Screen-2025-03-22_15-36-25](https://github.com/user-attachments/assets/a8977aea-72c7-4e62-92c4-a36d21549e8c)
- Added features that were previously available only in the NEO-derived version used in Petit Note and POTI-board in v1.6.15.  
Additionally, configuration options have been added to prevent compatibility issues.  
This eliminates the need to use the derived version.


### 2025/03/20 v6.68.6
### The popup menu in Shi-Painter is now operable on iPads
- With CheerpJ v3.1, posting with Shi-Painter became possible on iPads and smartphones. However, actions such as creating/deleting/reordering layers and changing blending modes were still limited to PC mouse operations, making these functions unavailable on mobile devices.  
- After reporting this issue to the developers of CheerpJ, a fixed version was provided in just two days.  
- This updated version is now supported in POTI-board, enabling Shi-Painter to be fully operational on iPads and smartphones.

![image](https://github.com/user-attachments/assets/a7a72d62-92d9-4181-86fc-d3b82dd24a24)

### Refactoring of the Mail Notification Class
- Incorrect escape processing that should not have existed was removed, and additional handling to delete unnecessary newlines was added.

### Issue Fixed: Shi-Painter Failing to Launch
- The issue where Shi-Painter failed to start on mobile devices using CheerpJ was reported to the developers. It was determined that corrupted CDN cache was the cause. As of March 19, 2025, the cache issue has been resolved, and the problem is fixed.


## 2025/03/10 v6.68.3
### Stopped using the `filter_input()` function, which is proposed for removal in PHP 8.5, and replaced it with a user-defined function
- The following RFC proposes the removal of the `filter_input()` function:  
  [PHP: rfc:deprecations_php_8_5](https://wiki.php.net/rfc/deprecations_php_8_5).
- If the proposal does not receive more than two-thirds approval, it will not be deprecated. However, by the time PHP 8.5 is released, there may be less time available for updates, so i decided to implement the changes while possible.
- Replaced all 125 occurrences of the `filter_input()` function with a user-defined function.

### Refactored old JavaScript
- Rewrote `loadcookie.js` using ES6 syntax and enabled strict mode (`"use strict"`).
- Added type checks to JavaSc

## 2025/03/05 v6.67.6
### JavaScript Type Checking
- Refactored a 22-year-old script, a dynamic palette script.
- Introduced TypeScript type checking to specify types, updated the code to ES6, and made it compliant with strict mode.
- Added type checking to JavaScript files handling cookie issuance to ensure more reliable value retrieval.

### Improvements
- Fixed inconsistencies in return type declarations for PHP functions.
- Optimized processing by skipping the calculation of the 20 omitted posts in the "20 posts omitted" message.
- Referencing CheerpJ documentation, specified the necessary files as startup options when launching Shi-Painter to reduce startup time.

## 2025/02/24 v6.65.6
## Bug Fix  
- Fixed an issue where other SNS platforms could not be selected when a Bluesky or Threads link was entered in the direct SNS sharing input.  

## 2025/02/14 v6.65.3 
#### Klecks Update
- Added "Scattering Parameter" to the Pen Brush.  
- Fixed a bug where the undo process for the Line Tool did not work correctly when rotating the canvas.

## 2025/02/14 v6.65.2  
- With CheerpJ v3.1, posting from smartphones and tablets is now possible. If the device screen width is 600px or more, Shi-Painter can be used.  
- Changed Twitter cards to Large size.
- Code cleanup: Reduced code size by using the nullish coalescing operator.

 
## 2025/02/06 v6.65.0  
### Updated CheerpJ to v3.1 for Running Shi-Painter on Modern Browsers (Chrome/Safari)  
- Updated CheerpJ to version 3.1, released on February 5, 2025.  
- With CheerpJ v3.1, the final "Yes" button in Shi-Painter's posting process can now be pressed using a pen on a pen tablet or a mobile device.  

## 2025/01/15 v6.62.9
### PaintBBS NEO Has Been Updated
- PaintBBS NEO has been updated to move the scroll control processing when touching the grid area around the canvas to NEO itself.
- Previously, external JavaScript was used to prevent scrolling when touching the grid area of PaintBBS NEO.
- In v6.62.7, a feature to skip the drawing timelapse when continuing a drawing was added, but undoing immediately after fetching the image caused the canvas to become blank.
- To solve this issue, the undo history from before skipping the timelapse is not saved when you continue drawing.

### Bug Fixes
- Fixed an undefined variable issue in the MONO template.
- Resolved an issue where an undefined variable error could occur due to the processing added in v6.62.7.

## 2025/01/13 v6.62.8
### Function Return Type Checking Implemented
- Using features introduced in PHP 7.1, function return types are now specified, and a fatal error will occur if a function does not return the expected type.  
Previously, the application would continue to operate even if the returned type was not as expected.  
This change makes it easier to detect bugs.  
### Hide "Save Playback" Checkbox for Tools Without Save Animation Functionality
![2025_01_08_save_Playback](https://github.com/user-attachments/assets/c1b91979-a72d-48f0-992a-3b24fad5f1a2)
- Previously, the "Save Playback" checkbox was displayed even when using paint tools like ChickenPaint that do not support Save Animation .
- The "Save Playback" checkbox will now only be displayed if the selected paint tool is PaintBBS NEO, Shi-Painter, or Tegaki.
### Layout Changes for Wide Canvas in Template MONO with Shi-Painter and NEO
- When opening a wide canvas with tools like Shi-Painter, the header and footer will now adjust to the canvas width.
- Previously, only the applet would extend horizontally.
- The dynamic palette placement for NEO and Shi-Painter in the MONO template will now always be aligned to the right.
- Previously, when the browser window was narrow, the palette would wrap beneath the applet.
### Return Destination from "Continue Drawing" and "Replay" Now Individual Posts
-  The "Back" link from "Continue Drawing" and "Replay" now leads to the individual post.
- Previously, it would return to the top of the board.

### ChickenPaint Has Been Updated

![2025_01_12_Maintain Clipping State When Merging with Lower Layer](https://github.com/user-attachments/assets/5e330ee9-9aad-4cf2-92ac-bcc0ca9a6f43)
- It is now possible to merge layers while maintaining the clipping mask.
- Previously, merging a clipping layer with the lower layer would disable the clipping mask, causing the paint to spill outside the intended area.

## 2024/12/24 v6.59.1.1
### Animation is no longer played on the PaintBBS NEO continue drawing screen
- Previously, when continuing to draw with NEO, the drawing animation of the steps taken was played, and you had to wait for the playback to finish or tap the screen to skip the playback.
- With this update, the drawing animation will no longer be played on the continue drawing screen, and only the layer information will be obtained from the animation data and output as a still image on the screen.
- This eliminates the need to tap to skip when the animation starts playing.
- This behavior is closer to the original PaintBBS.

## 2024/12/17 v6.58.0
### "Share on SNS" Now Support Meta "Threads"
  
![241216_Threads対応](https://github.com/user-attachments/assets/a07cb6fc-1df9-4a87-9ad7-fb54d372727f)
  
- You can now create shared links for Meta's SNS "Threads."
The number of files to be changed is small, but you will need to reconfigure `config.php` to make it compatible with "Threads."
If you do not need to make it compatible with "Threads," there is no need to reconfigure `config.php`.
```
$servers =
[

	["X","https://x.com"],
	["Bluesky","https://bsky.app"],
	["Threads","https://www.threads.net"],
	["pawoo.net","https://pawoo.net"],
	["fedibird.com","https://fedibird.com"],
	["misskey.io","https://misskey.io"],
	["misskey.design","https://misskey.design"],
	["nijimiss.moe","https://nijimiss.moe"],
	["sushi.ski","https://sushi.ski"],

];

// Width and height of window to open when SNS sharing

//window width initial value 600
define("SNS_WINDOW_WIDTH","600"); 
//window height initial value 600 
define("SNS_WINDOW_HEIGHT","600");

```
 
## 2024/12/12 v6.57.1
### Issue a warning if layer information has not been saved in PaintBBS NEO
- If time-lapse data has not been saved in PaintBBS NEO, a confirmation dialog will now be displayed saying "Layer information will not be saved.Are you sure you want to continue?".
### Improved Markdown link function
- Improved Markdown link `[string](URL)`.
If there is a `[]` within a `[]` that specifies a string, escape it with a backslash.
When escaped, it will become a link like this
[\[12345\] Petit Note](https://example.com)
Example)
```
[\[12345\] Petit Note](https://example.com)
```
## 2024/12/08 v6.56.6
### AXNOS Paint has been updated
- The UI is now easier to use even on devices with small screens.

## 2024/12/04 v6.56.5
### ChickenPaint Be has been updated.
- Displays the HTTP status code more clearly when the network response was not ok.
  
![image](https://github.com/user-attachments/assets/e2ec8c70-1d30-44cf-ac15-e3f031cef32b)

![image](https://github.com/user-attachments/assets/0942b769-d474-4504-a76f-fa6dec23d2a2)

## 2024/12/03 v6.56.3
### Review of user authentication code
- The user code has been expanded to 64 characters.
- The password is no longer used as a seed for the hash value of the authentication code when replacing an image.
- To improve the reliability of authentication, the authentication code when replacing an image now includes the article number and article ID as is.
- Added identity verification for posted images when replacing an image, and the image is posted only if the user code or IP address matches.
### Fixed an issue that occurred when replacing an image/editing an article after deleting an article.
- An issue occurs when someone deletes an article while an article is continuing, and the password of a new post posted afterwards is the same.
This is because the "article number" and "password" of the newly posted article are the same.
In this case, The new post is overwritten by the "continuation" post.
The same issue occurs if you delete an article you are editing and then post a new post with the same "article number" and "password" as the article you are editing.
- To avoid this issue, the UNIX time of the article is now used to check whether the article you are overwriting when "continuing" or editing is the same as the original article.

### ChickenPaint Be Update

[Feature request/proposal: converting brightness to opacity · Issue #4 · satopian/ChickenPaint_Be](https://github.com/satopian/ChickenPaint_Be/issues/4)

- Added a function to convert brightness to transparency.

- Based on the prototype created by [@SuzuSuzu-HaruHaru](https://github.com/SuzuSuzu-HaruHaru), we adjusted the method of calculating opacity and implemented it as a function equivalent to that of general paint software.

![image](https://github.com/user-attachments/assets/e90861fd-3edd-4e97-a50a-3f0889e37fad)

## 2024/11/26 v6.53.8
### Code cleanup
- The long foreach nest for image replacement has been shortened.
- Unnecessary basename() has been removed.
- The function that checked whether GD was available has been simplified and consolidated into a class method in thumbnail_gd.inc.php.

- In PHP8.4, exit() has become a function instead of a language structure, so `exit;` without parentheses has been changed to `exit();`.
`exit;` without parentheses may be deprecated in future versions of PHP.
### Bug fix
- Fixed a problem where explode() would fail and cause a PHP error if a non-existent article number was intentionally specified during password authentication processing when drawing a continuation.
(This did not occur in normal use, but was recorded as a PHP error in the server error log when an invalid process was performed.)

- Fixed a bug where additional explanations for the bulletin board were not displayed in the new post form even if they were specified in $addinfo in config.php;.
(Additional explanations were displayed when drawing and replying, but not in the new post form)

## 2024/11/21 v6.51.3
### 5MB limit on log file size removed
When the log file exceeded 5MB, the file was cut off in a way that required items were cut off in the middle of the log file.  
Therefore, the 5MB limit when acquiring a log file has been removed.  
Instead, a check on the log file size has been added.  
If the log file exceeds 15MB, an error message will be displayed. (When writing and pressing the paint button)  
However, by the time the log file size reaches 15MB, the bulletin board should be quite heavy.  
It has been proven that it works up to about 8,000 posts, but if it exceeds that, it is likely to become unstable.  

If you want to store more posts, consider using.  
satopian/Petit_Note_EN: Petit Note English ver. PHP script for PaintBBS NEO, tegaki.js,AXNOS Paint,ChickenPaint and Klecks. (PHP5.6 - PHP8.4)
https://github.com/satopian/Petit_Note_EN

This is a one thread, one log file format, so you can operate up to 8000 threads instead of 8000 comments.
With 200 posts per thread, you can have 8000x200=1.6 million posts.

### Added new configuration item to config.php
The limit value for the log file size check could be set to 15MB uniformly, but now it is configurable.
If you don't have any particular preference, there is no need to add a configuration item.
If the configuration item does not exist, the default limit value of 15MB will be applied.

```
// Maximum file size limit for the log file (in MB)
// Setting a large value may cause instability.
define("MAX_LOG_FILESIZE", "15");

```

## 2024/11/19 v6.50.3
### Replacing Functions Marked for Removal in the PHP 8.4 RFC with New Functions  

POTI Board EVO previously used functions that were proposed for removal in the PHP 8.4 RFC. Although these functions were not deprecated due to a slightly higher number of votes against their removal, I have decided to replace them proactively to ensure future compatibility.  

#### New Functions for Cryptographic Operations  
**Deprecation of `uniqid()`**  
I will stop using `uniqid()` and replace it with `random_bytes()`.  

#### Changing the Hash Algorithm for Duplicate Image Detection from `md5` to `sha256`  
**Deprecation of `md5()`**  
Since the deprecation of `md5()` was proposed in the PHP 8.4 RFC, the method for generating image hash values to prevent duplicate image posts has been changed from `md5` to `sha256`.  

```
// Reject files with the following image hashes.
$badfile = array("dummyhash","dummyhash2");
```
If you have specified images to reject, you must reconfigure this setting.


## 2024/11/11 v6.39.12
### The .htaccess description method has been changed to Apache 2.4 format
- Official support for Apache 2.2 ended in 2017, so the Apache 2.2 format .htaccess files has been rewritten to Apache 2.4 format.

## 2024/11/08 v6.39.11
### Display detailed error message when file size is too large in Klecks
- Display error message in format like "File size is too large. Limit size: 20MB Current size:30MB".
When the total size of PNG format image file and PSD format layer information output by Klecks exceeds the server's allowable size, it displays detailed information on why posting is not possible.
Until now, it only displayed "Your picture upload failed!\nPlease try again!"
Since the file size includes layer information, the more layers there are, the easier it is to exceed the limit.
The file size will be smaller if you combine layers.

![image](https://github.com/user-attachments/assets/967c4189-b32b-47e6-883a-2cfd9634b1e8)

When displaying Japanese.

![image](https://github.com/user-attachments/assets/5ab0a273-619c-4206-a24e-f2451aded124)

When displayed in English.

## 2024/11/06 v6.39.9
### ChickenPaint Be has been updated
- Displays a more detailed error message when the file size exceeds the server's allowable value.
Displays the current file size and displays the error message "The file size exceeds the server limit."
Previously, it only displayed "Sorry, your drawing could not be saved, please try again later."
If you merge and organize ChickenPaint Be's layers, the file size at the time of posting will be smaller. If you are unable to post because this error message appears, merging the layers may enable posting.
  
![image](https://github.com/user-attachments/assets/bc71e714-dde6-458e-bd57-e0d69859e2da)
  
If you have a rental server that has a default limit of 5MB and you want to allow file sizes larger than that, edit php.ini.
POTI-board looks at both post_max_size and upload_max_filesize and  ​​uses the smaller of them as the limit value, so you need to adjust the following two upper limits.
Please check the server manual for instructions on how to edit php.ini.

The units in the following setting examples are MB.
Please note that if you set the limit too high, you may be more vulnerable to DDoS attacks.
Considering the stability of JavaScript apps, I think a maximum of 25MB is appropriate.
#### Example settings

```
; Maximum size of POST data that PHP will accept.
; Its value may be 0 to disable the limit. It is ignored if POST data reading
; is disabled through enable_post_data_reading.
; https://php.net/post-max-size
post_max_size = 20M

; Maximum allowed size for uploaded files.
; https://php.net/upload-max-filesize
upload_max_filesize = 20M

```  
## 2024/11/03 v6.39.8
### ChickenPaint Be has been updated
- Fixed an issue where the ChickenPaint Be texture palette could not be scrolled.  
(Scrolling the texture palette is necessary on devices with small screens such as smartphones.)  


## 2024/11/03 v6.39.7
### Classify the series of GD processes for thumbnail creation to make the source code more readable
- As a result of cramming functions into `thumbnail_gd.php`, the readability of the source code significantly decreased, so we reorganized it into a static class.  
`thumbnail_gd.php` has been deleted.  
Use `thumbnail_gd.inc.php` instead.  
`thumbnail_gd.php` is no longer necessary, but there is no problem if it remains on the server.  
Please be careful when deleting, as you may delete a necessary file when trying to delete an unnecessary file.
thumbnail_gd.inc.php` is now a common class with [Petit Note](https://github.com/satopian/Petit_Note).  
There is no longer a need to maintain two types of files, one for Petit Note and one for POTI-board.  
### Fixed a bug that reduced the actual size of drawing images.
```
// The maximum size for width and height during upload, any larger will be resized.  
define("MAX_W_PX", "1024"); //Width  
define("MAX_H_PX", "1024"); //Height  
```
Fixed a bug that reduced the image size when the size set with `MAX_W_PX` or `MAX_H_PX` was smaller than the maximum size that can be drawn.  
The image size limit for drawing images should have been specified as the maximum size that can be drawn, and it was unintended that the image would become smaller than the initial image after posting.  

### When posting, the screen now scrolls to the posted reply
- Because there is an input field at the top, previously the top of the reply screen was displayed once posting was completed.  
However, this could make it difficult to tell if the reply comment was posted, so we've made it so that the screen scrolls to a position where the reply comment is visible.  

## 2024/11/01 v6.39.3
- I have improved the function to convert PNG images to JPEG when they exceed MAX_KB, and moved the GD processing that was processed in potiboard.php to thumbnail_gd.php.  
By utilizing the existing GD processing, the code in potiboard.php has been shortened.  

- When drawing, even if the image file size exceeds the value specified in MAX_KB, the post will be completed without an error.  
As before, images attached from the posting form will result in an error when they exceed MAX_KB.  
This specification has existed until now, but even if the original file size is very large, it will be reduced due to the vertical and horizontal limitations, and if the file size is larger than MAX_KB, PNG will be converted to JPEG, and if the final file size is within the MAX_KB range, the post will be successful.  

## 2024/10/26 v6.38.1
### ChickenPaint Be has been updated.
#### You can now change the brush size by dragging the circle in the brush preview screen with the pen

![2024-10-26-Brush Palette](https://github.com/user-attachments/assets/aa5747a9-6102-45fd-8fcd-05139e8894b4)  

- The process that was optimized for the mouse has been rewritten as PointerEvent so that it can be operated with the pen.  
In addition, to prevent malfunctions, the default behavior of touchmoveEvent for each palette and the main menu has been canceled.  
Fixed an issue where a dragged object would continue to move even if the pen was removed from the screen.  


## 2024/10/25 v6.38.0
### ChickenPaint Be has been updated.
#### Added noise texture to texture palette
![Image](https://github.com/user-attachments/assets/7799d25c-2783-44a5-bae0-9185a3c628b2)
- Added "Noise Texture" to "Texture Palette".
Previously, you could add noise by using the "Monochrome Noise" option in the Effects menu in combination with layer effects, but the addition of "Noise Texture" allows you to create a slightly different type of noise.  
By using it in combination with a pen or pencil, you can draw more pencil-like lines.  
It is also effective when applying thick paint with a watercolor brush.  

#### Disable texture when using eraser

- Added a process to disable texture when using eraser.  
You can now erase with the eraser even if a texture is selected.  
Previously, if you selected a texture and used the eraser, you could not erase it completely.  
- Textures are applied when using the soft eraser. Please use the soft eraser when creating patterns by combining textures with the eraser.

## 2024/10/23 v6.37.8
### Search code optimization
- To improve code readability, the same process was made into a function.
By making it a function, 16 lines that repeated the same process were reduced to 4 lines.  
### ChickenPaint Be updated
- Bootstrap is no longer declared globally, but is imported where necessary.  
In addition, processes that can be reduced were deleted.  
The build date is now listed in "About ChickenPaint Be".  
This makes it possible to see at a glance when ChickenPaint Be was built.  

![image](https://github.com/user-attachments/assets/79592935-e77b-4907-a4e3-05dc8dbe663a)


## 2024/10/15 v6.37.7
### ChickenPaint Be has been updated.
- The shortcut keys for zooming in and out in ChickenPaint Be have been changed to "+" and "-", the same as Klecks and AXNOS Paint.  
Previously, it was necessary to press the "ctrl key" at the same time, such as "ctrl + +" or "ctrl + -".  

- The file size of ChickenPaint Be has been reduced by 23.7%.  
By changing the build tool and removing the polyfill package used for IE compatibility, the file size, which was 779KB, has been reduced to 594KB.  
This weight reduction has made startup faster.  


## 2024/10/04 v6.37.6
### Lightbox Updated
- Lightbox updated to v2.11.5 and changed to a drawing board.
### AXNOS Paint Updated
- The background of the layer thumbnail images has been changed from a solid gray to a checkerboard pattern.  
This is a change in the unofficial version of AXNOS Paint. The original AXNOS Paint developer is not responsible for any issues caused by this change, so please do not contact the original AXNOS Paint developer.  

## 2024/09/30 v6.37.3
### PaintBBS NEO has been updated
PaintBBS NEO has a function to restore images when you move to another page or accidentally close the browser tab, but if you accidentally select a small canvas size when restoring, the image will be cropped to fit that small canvas size.  
Even if you then select a larger canvas size and reopen the image, the image will remain cropped small.  
With this update, you can now restore the image to its original size by selecting a larger canvas size and reopening it.  

## 2024/09/28 v6.37.2
### PaintBBS NEO has been updated
#### Images can now be restored even if the PC is turned off

PaintBBS NEO has a function to restore images when you move to another page or accidentally close the browser tab, but if the PC is turned off due to a power outage caused by lightning, images cannot be restored.  
Backup data was only saved when you moved to another page or closed the tab, so if an unexpected power outage caused by lightning occurred, the data for restoration was not saved.
To address this issue, data for restoration will be saved every 10 strokes.
Data will also be saved if the browser is closed.  
The data storage destination has been changed to local storage, similar to mobile devices.
However, this alone will still leave problems.  
Test drawing data, etc. will continue to be saved for more than a week and may be restored at unexpected times.  
Taking this into consideration, restoration data older than three days will be automatically discarded.  
Due to recent climate change, power outages due to thunderstorms are increasing.
With PaintBBS NEO v1.6.5, you can now restore your Drawing bulletin board data even in the event of a sudden power outage.  

Operation has been confirmed on PC versions of Chrome, Edge, and Firefox.  


## 2024/09/27 v6.37.0
### Now supports PHP 8.4
We created a test environment for the PHP8.4 RC version, which is scheduled to be released in November 2024, and tested POTI-board.  
As a result, we found that a deprecated error occurred in BladeOne.
Since PHP8.4 has not yet been officially released, it will be some time before BladeOne supports PHP8.4.  
For this reason, we created an unofficial patched version of BladeOne and included it.

### PaintBBS NEO update

Code that mixed substring() and slice() has been unified into slice(). (No change in behavior)

## 2024/09/19 v6.36.3
### ChickenPaint Be has been updated
- Removed unnecessary Bootstrap 3 and Bootstrap 4 legacy CSS classes.
### The singular "post" and plural "posts" are now displayed correctly.
- "1 post omitted" and "2 posts omitted" now display correctly in singular and plural.

## 2024/09/07 v6.36.1
### Updated the Paint screen template.
- Fixed a bug that caused image files such as PNG and JPEG to fail to load when continuing to draw with Klecks.
- Fixed a bug in template used with Klecks where loading a transparent PNG would result in a white background instead of transparent.
This issue was discovered late, as it did not occur when a PSD file with layer information was present.
- Fixed the 404 error message that appears when the file to save the image does not exist.
The error message displayed the file name that was included but not called directly.
### Updated AXNOS Paint
The released AXNOS Paint V2.3.0 has been remodeled for POTI-board.

## 2024/09/05 v6.36.0
### AXNOS Paint has been updated.
- The maximum and minimum canvas size set in the bulletin board are now reflected in the maximum and minimum canvas size in the AXNOS Paint Settings tab.
- If the browser's preferred language setting is anything other than Japanese, the UI now launches in English.
- The draft image loading process has been replaced with the official AXNOS Paint one.  
  
![image](https://github.com/user-attachments/assets/f086f1b0-28c5-428c-9e78-c84157d66789)
  

## 2024/08/21 v6.35.3
### Updates to AXNOS Paint derivatives
- Modified the layer compositing results to be closer to SAI and FireAlpaca.
This is currently a change to the specifications of AXNOS Paint derivatives, so if any problems with the layer compositing results occur due to this change, it is a problem with the derivative, not the original version.
- Implemented a measure to prevent repeated pressing of the post button in AXNOS Paint and Tegaki
Fixed an issue where multiple images were sent when the post button was pressed repeatedly, and were added to the list of unposted images.
Changed the communication process to comply with AXNOS Paint specifications.

## 2024/08/09 v6.35.2
### AXNOS paint has been updated.
- Resolved an issue when moving the tool palette on Mac Safari browser.  
This issue does not reproduce in the latest versions of Safari. This is an unofficial fix to address an issue occurring in Safari 14.  

## 2024/08/08 v6.35.1
### Now supports AXNOS Paint.
[What is AXNOS Paint (What is Axnos Paint) [Word article] - Niconico Encyclopedia](https://dic.nicovideo.jp/a/axnos%20paint)  
  
![Image](https://github.com/user-attachments/assets/367fc239-7897-4859-904d-08e91f5cf75e)
  
### A new setting item has been added to config.php
```
//Use Axnos Paint 
// (1: Enabled, 0: Disabled) 
define("USE_AXNOS", "1");

```
If this setting item does not exist, Axnos Paint will be used.
If you don't want Axnos Paint to appear in the paint app selection list, add the above setting.


## 2024/08/04 v6.33.8
### ChickenPaint Be Updates
- The Blur tool in the Tool Palette now has a shortcut key set to U.
This assigns all shortcut keys in the Tool Palette except for rotating the canvas and moving the hand tool.
Since rotating the canvas is already available with R+drag and the hand tool with Shift+drag, there is no need to set shortcut keys for these functions in the Tool Palette.
- The apply transform button now expands to the full width of the palette, just like in the original ChickenPaint.
This was an issue we ran into when we changed to Bootstrap 5, which was missing some needed CSS from the original ChickenPaint, so we restored some of the CSS from the original ChickenPaint.
### potiboard.php code cleanup
- The code handling matching article numbers and passwords when rendering continuations is now less nested.

## 2024/07/27 v6.33.6
### Added error message.
>"MSG051", "[Locked due to incorrect password attempts.]"

## 2024/07/27 v6.33.5
### Fixed a bug in ChickenPaint Be.
- 2024/07/13 In v6.32.9, ChickenPaint Be starts with two layers, but the transparent layer that is automatically created at that time did not work properly.
When drawing with a watercolor brush, black was dragged and the screen became black.
This issue was fixed by setting the layer color correctly.

## 2024/07/19 v6.32.11
### ChickenPaint Be has been updated.
- Added a duplicate icon to the Layer palette.
You can now duplicate layers and layer groups with one tap.
Previously you had to use a shortcut key or select duplicate from the top menu.
- Changed the Merge Down icon.
- The layer group merge icon is now in the same position as the Merge Down icon.
When you select a layer group folder, it becomes the group merge icon, and when you select a layer, it is replaced by the Merge Down icon.

![Added a duplicate icon to ChickenPaint's Layer palette](https://github.com/user-attachments/assets/75543a04-3e51-4960-9c97-571cf8e007a0)


## 2024/07/13 v6.32.9
### ChickenPaint Be updated
- Starts with a total of two layers: background layer and transparent layer.

Reduces accidents of drawing lines on a white background layer.

![image](https://github.com/user-attachments/assets/bd641562-5f49-4d27-b938-fe9b3c0d5501)


## 2024/07/05 v6.32.7

### Updated ChickenPaint Be
- If the iPad Air width or height is 820px or less and is a touch device, it will launch in mobile mode.
Previously, the width or height was 800px or less, so the app launched in PC UI when using iPad Air.

Also, the app switched to the mobile screen when the browser window size was reduced on the PC, but by adding touch device detection processing, the app will launch in PC UI when using PC.

### Updated .htaccess
- The setting was set to prohibit the calling of files with the `.json` extension. However, this also prohibits the calling of `manifest.json`, which sets the icons to be set on the home screen of PWA and smartphones. Since this makes it impossible to set touch icons, the setting was changed to allow the calling of files with the file name `manifest.json`.

### Updated the template engine BladeOne to the latest version
- BladeOne has been updated to the latest version v4.13.


## 2024/06/19 v6.32.5
![localhost_221021_59_poti-kaini-EN_potiboard5_potiboard php_mode=newpost(iPad Mini)](https://github.com/satopian/poti-kaini-EN/assets/44894014/6edfbe7e-306d-4c8e-84b4-69404441a38d) ![localhost_221021_59_poti-kaini-EN_potiboard5_potiboard php_mode=newpost(Pixel 7)](https://github.com/satopian/poti-kaini-EN/assets/44894014/16db4c3f-9fb5-415d-a051-c2849ecb7983)

The template has been updated.
The explanations for the form input fields have been made easier to understand.
The way the form is displayed on mobile devices has been changed.

## 2024/06/12 v6.32.2

### ChickenPaint Be updated

- Fixed an issue where the text on the opacity adjustment slider in the layer palette was blurred.

![image](https://github.com/satopian/Petit_Note/assets/44894014/021ccbba-4c53-4299-8655-6a188910e754)

- Increased the spacing between the tool option sliders so they can be operated with your finger.


## 2024/06/10 v6.32.1

### ChickenPaint Update
- Switch to mobile UI and collapse palette when using a device with width and height less than 768px. The UI takes up less space and you can draw on a larger canvas.

https://github.com/satopian/Petit_Note/assets/44894014/efb5fe8e-aafe-44c6-b3a0-b01b54b5c5f0

- The margins of color swatches in mobile UI have been enlarged so that they can be tapped with a finger.

### Issue where on-screen keyboard appears when tapping the drawing time clock on PaintBBS NEO drawing screen
- Added readonly attribute to prevent on-screen keyboard from appearing.
![Screenshot_20240610-103937_600](https://github.com/satopian/Petit_Note/assets/44894014/f7c27259-b996-4e5a-88ff-3a97fcf80c89)
This issue occurred before 2018.


## 2024/06/09 v6.31.23
### ChickenPaint Be Update
- The thickness of the palette title bar in smartphone mode has been increased to make collapse/expand easier.
- The spacing between the operation icons in the layer palette in smartphone mode was narrow, so it has been widened.
- Displaying both the collapse/expand icon and the close icon could lead to accidental tapping and accidentally closing the palette, so the close icon is no longer displayed in smartphone mode.
Instead, use the show/hide shortcut menu at the top.

![Screenshot_20240609-201946](https://github.com/satopian/poti-kaini/assets/44894014/e9608591-78d4-4614-a8f4-ae27900e452c) ![Screenshot_20240609-201955](https://github.com/satopian/poti-kaini/assets/44894014/c9d77422-0277-4fd8-b984-9cb624b34020)


## 2024/06/08 v6.31.22
### ChickenPaint Be Update
- The shortcut menu for hiding palettes is now always visible on devices other than smartphones and tablets.
- Further optimized responsive design for different widths.
- The color of the shortcut menu has been changed from yellow to light gray.

https://github.com/satopian/Petit_Note/assets/44894014/e2519331-4898-462f-b911-c8b483acb011


## 2024/06/07 v6.31.21

### ChickenPaint Be's Update
- The brand logo is now intentionally visible even in smartphone mode to prevent accidentally tapping the browser home button.
- The shortcut menu to hide palettes now spans the entire width of the device.
Previously, the spacing was too narrow, so it was sometimes impossible to tap the yellow shortcut menu where you intended.

![Screenshot_20240607-214641](https://github.com/satopian/Petit_Note/assets/44894014/fe33539d-959d-477d-ab33-008a9b431e7d) ![Screenshot_20240607-214737](https://github.com/satopian/Petit_Note/assets/44894014/1885f673-b6a5-49fe-801b-13b9e01e5841) ![Screenshot_20240607-214650](https://github.com/satopian/Petit_Note/assets/44894014/d9726f15-f5c8-4956-b611-e0f8c0f78a05)  
![Screenshot_20240607-214831](https://github.com/satopian/Petit_Note/assets/44894014/28eec37d-aca1-4250-a2bd-89a6eff16221)  


## 2024/06/06 v6.31.20

- In v1.36.10, we fixed the issue of the canvas size not returning to full screen after entering numerical values ​​for blurring, grid settings, etc., when using the ChickenPaint menu on a smartphone. However, there was an issue with the palette placement being misaligned when performing this operation, which remained as an issue.
We found that this issue was caused by both the modal window and the Hamburger menu being displayed, so we set it so that the display event of the modal window is obtained and the Hamburger menu is automatically closed.
This fixed the issue of the palette placement being misaligned.
- Detects changes in the orientation of the smartphone or tablet and initializes the palette placement of ChickenPaint.
In v6.31.10, we added a process to initialize the palette placement when the window size was changed, but the appearance of the on-screen keyboard when renaming a layer was detected as a window size change, making it impossible to change the layer name, so we decided to initialize the palette placement when the smartphone or tablet orientation was changed.
- If you want to change brushes while drawing, collapsing the palette each time would require more taps.
Since you can hide all palettes by tapping the shortcut menu in Mobile mode, we have removed the auto-collapse feature for tool palettes.
- Smartphone mode with collapsed palettes can now be displayed even on smartphones with large screens.

![Screenshot_20240607-141136](https://github.com/satopian/Petit_Note/assets/44894014/078b3f26-1a21-4be0-b248-8b06518b8bfe)  

![Screenshot_20240607-141149](https://github.com/satopian/Petit_Note/assets/44894014/73b84217-2216-4970-b540-1f98734da059)  


## 2024/06/01 v6.31.10
- Fixed an issue where the canvas size would not return to full screen after entering numerical values ​​for blurring, grid settings, etc., when using the ChickenPaint menu on a smartphone.
- ~~To address the issue where the layer palette would not appear in the expected position when tilting the smartphone vertically or horizontally, the palette layout is now automatically initialized when the screen is resized.
The palette layout is also initialized every time the browser window size is changed on a PC.
This also solves the issue where the palette would shift to the left when the window width was narrowed and would not return to its original position even if the window was widened again.
However, since the palette layout is initialized even if the window is changed slightly, problems may occur if you want to move the palette position while drawing.
However, it will not be initialized unless the window size is changed, so there should be no problem if you draw with a fixed browsers window size.~~


## 2024/05/28 v6.31.9
- Adjusted the operation icons of ChickenPaint Be's layer palette so that they fit in one horizontal row.

## 2024/05/26 v6.31.8
### Added horizontal flip icon to ChickenPaint Be
- Added a horizontal flip icon to the operation palette of ChickenPaint Be.  
You can now easily flip horizontally even on devices that cannot use keyboard shortcut keys.

![左右反転アイコンを追加](https://github.com/satopian/Petit_Note/assets/44894014/f01c755a-801f-4ca8-9269-d76f2d7dd446)


## 2024/05/23 v6.31.3
### ChickenPaint Be has been updated

- Updated the bootstrap used by ChickenPaint Be to v5.3.3.
- Fixed ChickenPaint Be's deprecated JavaScript syntax `returnValue`.


## 2024/05/21 v6.31.2
### twitter.com→x.com
Even if the setting is `twitter.com` or `x.com`, a SNS sharing link will now be created with the `x.com` URL.

```
// Servers displayed in the list when sharing on SNS
//Example ["Display name","https://example.com (SNS server URL)"], (comma is required at the end)
$servers =
[

	["X","https://x.com"],
	["Bluesky","https://bsky.app"],
	["pawoo.net","https://pawoo.net"],
	["fedibird.com","https://fedibird.com"],
	["misskey.io","https://misskey.io"],
	["misskey.design","https://misskey.design"],
	["nijimiss.moe","https://nijimiss.moe"],
	["sushi.ski","https://sushi.ski"],

];
```
You can now create a link to `x.com` without any problems even if the URL of X (old Twitter) in `config.php` remains `twitter.com`.
If you don't mind leaving the name of the SNS that opens in the list as "Twitter", there is no need to modify config.php.
However, the settings in `config.php` take precedence, so if you want to display the old Twitter as "X", change to `["X","https://x.com"] ,`.

## 2024/05/13 v6.31.1
### Improvement
  
- Even if Bluesky is not in the sharing list, you can now share to Bluesky by directly entering `https://bsky.app`.  
- Fixed an issue where when sharing to X, Bluesky, Misskey, etc. on a smartphone, the app version would launch and the shared server selection screen would remain on the Chrome side.  
We solved this problem by closing the screen when the focus is removed from the SNS shared server list screen.  
However, if the screen has already been moved from the list screen to an SNS site, it will not close even if the focus is removed.  
If so, it's because you're already typing or viewing a social media post.  
Also resolved the problem that occurred when using the app on a PC, where multiple SNS sharing windows remained open.  

## 2024/05/07 v6.31.0
### "Share on SNS" now supports Bluesky
![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/79a98272-529c-442d-812b-b3db2a42dc1e)

```
// Servers displayed in the list when sharing on SNS
//Example ["Display name","https://example.com (SNS server URL)"], (comma is required at the end)

$servers =
[

	["Twitter","https://twitter.com"],
	["Bluesky","https://bsky.app"],
	["pawoo.net","https://pawoo.net"],
	["fedibird.com","https://fedibird.com"],
	["misskey.io","https://misskey.io"],
	["misskey.design","https://misskey.design"],
	["nijimiss.moe","https://nijimiss.moe"],
	["sushi.ski","https://sushi.ski"],

];

```
Bluesky must be added to the SNS server list in config.php.  
`["Bluesky","https://bsky.app"],`


## 2024/04/20 v6.30.8
```
const handleExit=()=>{
```
When I attempted to change `handleExit` to a constant by adding `const`, this function stopped working. To avoid that, the `handleExit` function has been moved from inside "DOMContentLoaded" to outside.

## 2024/04/16 v6.30.7
### Autolink feature now supports Internet Archive URL format
Fixed regular expressions for automatic links. Identifies `:` as part of the URL.
This allows automatic linking of Internet Archive URLs.
#### Example URL for autolink feature
`https://example.com/https://www.example.com`

## 2024/03/29 v6.30.5
### ChickenPaint has been updated.
Fixed an issue where the ChickenPaintn screen would remain scrolled and the menu bar would disappear when you finished using the iPad's onscreen keyboard.
When you rename the ChickenPaint layer, an onscreen keyboard appears and forces scrolling.
Displaying the onscreen keyboard forces the screen to scroll. And I had a problem with the keyboard not returning to its original position after it disappeared.
Fixed this issue.


## 2024/03/18 v6.30.3
### Fixed an issue where IP address check did not work when using Java Applet + IPv6
The IP address sent by the Java applet is IPv4, but the PHP script receives an IPv6 IP address.  
As a result, there were cases where posts were not determined to be by the same person.  
Fixed an issue where the image would not be displayed in the posted image list even if you posted a drawing image due to an IP address mismatch.  
Even if the IP addresses do not match, if the cookies match, the image will be displayed in the posted image list, so this problem rarely occurred.  
### "Tegaki" updated
In addition to the conventional right-click, you can now register colors in the palette by long-pressing with a pen or finger.
However, if you press the palette for a long time, it will become a long press and will register the color instead of selecting the color.
Please be careful not to press for too long when just picking up colors.
### "ChickenPaint Be" updated
Added shortcut keys. You can now invert negative and positive images using "ctrl+i".
It is also possible to invert negative and positive layer masks. You can also invert the visible area by inverting the negative/positive mask.

## 2024/03/11 v6.29.0
Due to the update of the template engine BladeOne, the operating environment has been changed to PHP7.4-PHP8.2.  
If PHP is lower than 7.4, please switch the PHP version using the server control panel etc. to PHP 7.4.0 or higher.  

## 2024/03/06 v6.28.0
### Fixed an issue where the Palette selection menu in ChickenPaint Be did not work on iPad iOS.
Fixed an issue where the ChickenPaint Be selection menu was not working in Safari and Chrome on iPad iOS.
### Fixed an issue where it was possible to post using a password other than the admin password even if the admin pass was set to be required for new posts.
Fixed a bug where new posts were made using a password other than the administrator password, even though the administrator password was set to be required for new posts.
This is a bug that has existed since v3.x.

## 2024/02/26 v6.27.9
### While drawing, the browser's default shortcut key "ctrl+o" is disabled

## 2024/02/24 v6.27.8
### Improvement
The format of article IDs sent via email has also been unified to `"?res={$resno}#{$no}"`.
### Bug fixes
Fixed an issue where `session_start()` was called in `picpost.inc.php` when the SESSION had already started, causing a minor error.
### Avoid warnings from Chrome
Avoid warnings from Chrome by explicitly setting "passive" values for ChickenPaint and PaintBBS NEO event listener handling.

### Improvement. 
Sensitive data in Java applet Shi-Painter has been changed from GET to more secure POST.

## 2024/02/21 v6.26.10
### Improvement. 
Changed sensitive data in the HTML5 version of the Paint app from GET to more secure POST.
### Bug Fix
Fixed undefined error in paint time.
Fixed an issue where Shi-Painter posting would fail when using the Waterfox Classic+Java plugin.

## 2024/02/18 v6.25.7
### Fixed a lightbox vulnerability discovered by GitHub code scanning
Fixed an issue where variable text was being interpreted as HTML.

## 2024/02/12 v6.25.5
### Improved key input restrictions for PaintBBS NEO
On the screen where NEO is running, key operations other than NEO's keyboard shortcut keys and text input could not be performed.
Therefore, it was only possible to use the right-click menu of the mouse to paste palette data to the "textarea" of the dynamic palette.
It was also not possible to edit the pasted palette data.

![image](https://github.com/satopian/Petit_Note/assets/44894014/8b5ec588-def4-4950-97b2-d4d381f75831)

By acquiring and pasting dynamic palette data, you can use your own palette on any bulletin board.
With this update, it is now possible to enter keys in the palette data input field.
Like the original PaintBBS, ctrl+v (paste) crtl+x (cut) ctrl+c (copy) crtl+a (select all), etc. can now be used in the palette data input field.

Additionally, an issue where browser shortcut keys such as ctrl+r (reload) would work when using the text input function has been fixed.

## 2024/02/09 v6.25.2
### Fixed an issue where neo's drawing animation file size became too large and could not be posted.
We fixed an issue where neo's drawing animation file size was too large for the server to handle, causing all posts containing images to fail.
If the post from neo exceeds the POST limit, we will stop posting the drawing animation file and allow the image post to succeed.

![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/672a08f1-93cc-4aaa-9f0b-48041de6c631)

If you want to upload a large drawing animation file, please make the following settings in php.ini.

```
upload_max_filesize = 25M
post_max_size = 25M

```

## 2024/02/05 v6.23.1.1
### CheerpJ v3.0 supports Shi-Painter's drawing playback function and detailed settings of dynamic palette
#### CheerpJ v3.0 is now available
CheerpJ is a tool that converts Java applets to JavaScript on your browser.
Previously, with CheerpJ v2, it was not possible to adjust the brightness or create gradients in the dynamic palette of the Java applet ShiPainter or PaintBBS. 　

Unfortunately, CheerpJ v3 is designed to not work on XAMPP's Localhost, and posts by Shi-Painter will also fail.
This can be said to be a specification of CheerpJ because it only supports Java applets that are published on the Internet, not in the local environment.
#### If you need CheerpJ v2.3, set it in config.php

```
//Use an older version of CheerpJ Yes:1 No:0
//If there is a problem with the latest version, do this:1
define("USE_CHEERPJ_OLD_VERSION","1");

```
## 2024/02/03 v6.22.1
### Use "Lightbox" for pop-up displays
"Luminous" which was used to display popup images, The LICENSE file has been removed from the repository, so LICENSE is now unknown.
To resolve this issue, use a "Lightbox" to display the popup.
I'm customizing the "Lightbox" to create a "luminous" like popup.
- Make transparent PNG transparent
Since the background color of the "Lightbox" is white, I made the background part transparent so that the background of the transparent PNG image can be seen through.
- Long press on image to save
In "Lightbox", you cannot save an image by long-pressing it, so I adjusted the CSS so that you can save it by long-pressing the image.
- Reposition the forward and backward navigation bars.
The arrows that display the previous and next images that were displayed above the image have been repositioned to match the left and right width, and if there is space on the left and right, the navigation arrows will be displayed on the left and right.  
- Close button
Images now close when pressed anywhere other than the fo prev / next navigation arrows.
As a result, the close button is no longer needed.
- Image loading image
Change the loading circle GIF to two large and small circles created with transparent PNG. Rotate the image using CSS3.

## 2024/01/30 v6.21.1
### Fixed an issue where it would become impossible to post if cookies disappeared while drawing
The system that matches the cookie value set in HTML with the actual cookie value has been abolished.
Even if the cookie does not exist at the time of posting, it is now possible to reissue the user code cookie and post.
I believe that this not only addresses the issue of cookies disappearing from the user's browser, but also the issue of cookies not being able to be verified due to the server's WAF settings.
Also, information was packed in the extension header of Shi-Painter and PaintBBS NEO, but we have switched to a method of obtaining it with GET parameters instead of via the extension header.
To maintain compatibility, if it is not possible to obtain with GET, it is now possible to obtain with extension header.

## 2024/01/24 v6.20.2.5
### Updated the ChickenPaint.
- This ChickenPaint is a customized from original [ChickenPaint](https://github.com/thenickdude/chickenpaint).  
[satopian/ChickenPaint_Be Customized ChickenPaint working with Bootstrap5](https://github.com/satopian/ChickenPaint_Be)  

#### Fixed an issue where shortcut keys would not work when operating a check box or select box on a palette.  

#### ChickenPaint shortcut keys have been changed.
- Redo is "ctrl+y".
- Transform is "ctrl+h".



## 2024/01/22 v6.19.5
### Updated the ChickenPaint.
- This ChickenPaint is a customized from original [ChickenPaint](https://github.com/thenickdude/chickenpaint).
[satopian/ChickenPaint_Be Customized ChickenPaint working with Bootstrap5](https://github.com/satopian/ChickenPaint_Be)

Using icomoon, the file size required to load fontawesome fonts was reduced to 1/18.
The HTML of the dropdown menu has been unified to Bootstrap 5.3 format.


## 2024/01/14 v6.19.0
### Fixed bug
- Fixed a bug that caused "Cookie check failed" when painting.

## 2023/01/07 v6.18.5
### Updated the ChickenPaint.
- The code has been significantly updated to work with Bootstrap5 instead of the older Bootstrap4.
- Fixed minor bugs.
- This ChickenPaint is a customized from original [ChickenPaint](https://github.com/thenickdude/chickenpaint).
[satopian/ChickenPaint_Be Customized ChickenPaint working with Bootstrap5](https://github.com/satopian/ChickenPaint_Be)

## 2023/12/30 v6.17.9
### Fixed a bug in ChickenPaint's grid settings
Fixed a bug where when pressing the enter key to confirm numerical input in ChickenPaint's grid settings, the screen would move to the top of the bulletin board and the drawn picture would disappear.

## 2023/12/27 v6.17.8
### Fixed so that you can post even if the user code cookie disappears for some reason
- Fixed an issue where an error "User code mismatch" occurred and posts that were supposed to be able to post failed.
Set a user code in both the cookie and SESSION data so that it can be posted if either the cookie or the SESSION matches the user code.
- Performs a cookie check when starting drawing mode, and checks in advance whether the user code matches the user code stored in Cookie or SESSION.
Checks for problems and displays error messages before you start drawing.
This fixes an issue where drawing work is lost.


## 2023/11/30 v6.16.7
### Add shortcut key for ChickenPaint

- Press the “D” key to switch to Smudge tool.
- Press the “C” key to switch to Blender tool.


## 2023/11/30 v6.16.6
### PaintBBS NEO Shortcut Keys Fixed an issue where the Firefox menu bar would show/hide when the Alt key was released.

## 2023/11/29 v6.16.2
### Updated tegaki.js.
- Fixed an issue where keyboard shortcut keys would stop working immediately after pressing the alt key.


## 2023/11/28 v6.16.1
### Fixed bug in customized version of ChickenPaint

## 2023/11/27 v6.15.9.3
### Fixed bug in customized version of ChickenPaint
### Add shortcut key for ChickenPaint

- Press the “A” key to switch to airbrush tool.


## 2023/11/26 v6.15.9.2
### Fixed bug in customized version of ChickenPaint

## 2023/11/25 v6.15.9.1
### Fixed syntax error in customized version of ChickenPaint

## 2023/11/25 v6.15.9
### Add shortcut key for ChickenPaint

- Rotate the canvas with "R" key + left click.
- Press the "H" key to flip horizontally.
- Press the “W” key to switch to watercolor brush tool.
- Press the "S" key to switch to soft eraser tool.

https://github.com/satopian/Petit_Note/assets/44894014/2075f812-19d4-4409-9478-9bf0a49a3c59

## 2023/11/23 v6.15.8
### ChickenPaint has been updated
- ChickenPaint has been updated.

### Switch the image popup display to gallery mode when there are multiple images in the individual thread display.
- When displaying Luminous' image popup display in a separate thread, if there are multiple images, they will be displayed in gallery mode.
View previous and next images Use the arrows to view images in sequence.


## 2023/11/18 v6.15.6
### Fixd bug
Fixed an issue in "Waterfox Classic" and "Pale Moon" where an error would occur during POST from Shi-Painter started using the Java plugin.

### Improvement
- Added a corruption check function for images sent from Shi-Painter.
Added a check for image corruption that is already implemented in drawing apps other than Shi-Painter.

### Klecks Update
- Updated Klecks.


## 2023/11/07 v6.12.1
If the PNG image sent from the drawing app is corrupted, the drawing screen will not switch to the posting screen. You will then receive an error message asking you to take a screenshot.

![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/9e667664-1bce-44de-99af-8e392e551f21)


## 2023/11/04 v6.11.11
### Updated Paint app
- Updated ChickenPaint.
- Updated Klecks.

## 2023/11/02 v6.11.10
### improvement
- Improved processing when JPEG images are rotated or have location information added.
Previously, when rotation or position information was detected, a JPEG image of the same size was output.
With this update, it is now scaled down to the value specified by `MAX_W_PX` and `MAX_H_PX` (for example, 1024px).
This eliminates the need to process the image a second time if the width and height exceed the specified values.
This eliminates the wasteful processing of creating a JPEG image and then creating the JPEG image again, as well as the deterioration of image quality.
### updated Klecks.
- updated Klecks

## 2023/10/29 v6.11.5
### Added the ability to reduce the size of images that exceed the specified width and height range.
This isn't about creating thumbnail images.
Reduces the size of the uploaded image itself. so, just like Discord.

### New setting items have been added to config.php

```
// The maximum size for width and height during upload, any larger will be resized.
define("MAX_W_PX", "1024"); //幅(width)
define("MAX_H_PX", "1024"); //高さ(height)

```
### Analyze the Exif
Analyze the Exif and if the image is rotated, correct it to the correct orientation.
If location information is included, it will be deleted.

## 2023/10/25 v6.10.8
JavaScript for mobile judgment processing has been externalized.
Removed unused code.

## 2023/10/23 v6.10.7
### Bug fix
The bug preventing Shi Painter from starting in version 6.10.6 has been fixed.

## 2023/10/23 v6.10.6
### The conversion conditions from PNG to JPEG have changed.

Previously, both the drawn image and the uploaded image were converted from PNG to JPEG when the `IMAGE_SIZE` setting was exceeded, but now only the uploaded image is affected by the setting.

If an error occurs and you cannot post because the posting capacity limit of `MAX_KB` is exceeded, both the drawn image and the uploaded image will be converted from PNG to JPEG.
After conversion, if the file size is reduced to a size that can be posted, it will be posted in JPEG format.


## 2023/10/21 v6.10.2
### It is now possible to configure the minimum width and height for drawing.
New setting items have been added to config.php.
```
// If a drawing size smaller than this is input, it will be the minimum value set here.
define("PMIN_W", "300");	//幅 (width)
define("PMIN_H", "300");	//高さ (height)

```
### Fixed an issue where the layout was broken when the width of PaintBBS NEO was less than 300px.

![20231021_NEOキャンバスサイズ50px](https://github.com/satopian/poti-kaini-EN/assets/44894014/31e9d039-252b-4d74-b05e-434d3c7e843a)

## 2023/10/17 v6.09.0

### improvement
- Fixed an issue where the Open in another tab button on the search screen remained disabled.
- The response display screen has been displayed faster.

## 2023/10/13 v6.08.0
### fixd bug
```
// Use the oekaki function  (1: Enabled, 0: Disabled)
define("USE_PAINT", "0"); 

//Allow admins to use all apps regardless of settings
// (1: Enabled, 0: Disabled) 
define('ALLOW_ADMINS_TO_USE_ALL_APPS_REGARDLESS_OF_SETTINGS', '1');

```
Fixed a bug where the canvas size value was not displayed on the Paint form when using this configuration combination.
### Improvement

To simplify the work, we externalized the paint form so that it can be used as a common component.

## 2023/10/10 v6.07.10
### Security Update
Added mime type check for pch files of Java's Shi-Painter and PaintBBS.

## 2023/10/03 v6.07.8
### Reduce memory consumption by 50%
Previously, with POTI-board, if 10,000 comments were recorded in the log file, even if only one comment was displayed on the reply screen, it would read the data for 10,000 comments.
To solve this problem, we have made it possible to retrieve only the necessary parts from the log file when displaying the reply screen or catalog screen.
### Improved numerical input of tegaki.js
We have updated our own modified version of tegaki.js.
Improved direct numerical input of brush size and opacity. The up arrow key increases the value and the down arrow key decreases the value.

## 2023/10/02 v6.06.1
- Optimized the display conditions for the thumbnail images of the previous and next threads at the bottom of the reply sending screen.
Split processing before and after the current thread for a more optimal display.
- Security update.
Fixed an issue where mime type was not checked when acquiring ChickenPaint specific format files.
It also checks the mime type when downloading app-specific files.

## 2023/09/21 v6.03.0

### Improvement

- Rewritten ChickenPaint's sending process to "fetch API" from old "xhr".
(PaintBBS NEO, Tegaki, and klecks have already been sent using the "fetch API")
- Change the template's "Web Style" to "Template".

- The corresponding thread is now displayed when posting a new post or replying to a post.
Previously, the top of the bulletin board was displayed when a new post was posted, and the corresponding thread was displayed when replying to a post.

### Bug fixes
Fixed an issue where validation was not performed when logging tool names to log files.

## 2023/09/09 v6.01.7
- The first and last page of paging can now be displayed. Click "Last" to display the oldest posts.
- The number of images displayed on one page when in catalog mode was fixed at 30, but can now be set.

## 2023/09/09 v6.00.10
- Fixed a minor error that occurred when accessing from a browser other than a browser without a user agent.
- Reduce the load by checking whether the drawn animation file exists before checking its extension.
- Corrected that the calculation part of the last update date on the search screen did not correspond to the year 2286 problem.

## 2023/08/30 v6.00.7
- shi-Painter -> Shi-Painter

## 2023/08/30 v6.00.6
The image attached and uploaded is now displayed as "Tool:Upload".

## 2023/08/28 v6.00.5

### Extended log file
The name of the paint tool used is now displayed.  
Addresses the year 2286 problem.  
The type of timelapse file and the presence or absence of thumbnails are now recorded in the log file. As a result, the load can be reduced because it is not necessary to check the existence of the file each time.   
  
Log files are backward compatible.  
It can also be read with an older version of POTI-board.  
Conversely, POTI-board v6.x can also read old version log files.  
Log files do not need to be converted, you can use your existing log files.  

## 2023/08/13 v5.63.8
### Added option to hide [Admin mode] link. 

#### Added this option to config.php.

```
// Display a link to the [Admin mode]  Yes: 1 No: 0
define("USE_ADMIN_LINK", "1");
// No: 0 Hide link to the admin mode.
```
## 2023/08/07 v5.63.7.1

- klecks/  (Update directory by overwriting)
- potiboard.php
- templates/mono_en/paint_klecks.blade.php
- templates/mono_en/mono_paint.blade.php

## 2023/08/04 v5.63.6.1
### Updated Klecks and Tegaki

- klecks/  (Update directory by overwriting)
- tegaki/  (Update directory by overwriting)

## 2023/08/04 v5.63.6

### Fixed bug.
- Fixed a bug that could not be displayed in IE mode of Edge.


## 2023/07/27 v5.63.5
### Fixed bugs.

- potiboard.php
- search.inc.php
(Some variables were undefined.)
- templates/mono_en/mono_main.blade.php
(There was a part where the search link was still "search.php".)
- templates/mono_en/paint_tegaki.blade.php
(When used on an iPad, the screen was being magnified by double-tap zoom.)

## 2023/07/13 v5.63.3

### You can now set the width and height of the window that opens when sharing on SNS in config.php.
Added a new setting item to config.php.

""

// Width and height of window to open when SNS sharing

//window width initial value 350
define("SNS_WINDOW_WIDTH","350"); 
//window height initial value 490 
define("SNS_WINDOW_HEIGHT","490");

""

When adding a server for SNS sharing, the height of the shared screen window was insufficient and scrolling was sometimes required.
Solved the problem by making it possible to set the width and height of the shared screen of the server list when sharing with SNS.
If the above setting items do not exist in config.php, the default values of 350px width and 490px height will be applied.

## Change log (timezone: Asia/Tokyo, UTC+09:00)
## [2023/07/12] v5.63.2
### Improved selection operability of SNS server to share posts

![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/c96c380c-3b72-4d1d-baa1-27a74eee7dda)

Servers to share can be selected not only directly above the label string, but also by tapping the right margin of the label.
- petitnote/template/basic/set_share_server.html
Fixed HTML grammar errors.

## [2023/07/11] v5.63.1
### Replace search.php with search.inc.php
The structure of jsearch.php has been fundamentally overhauled, modified and incorporated into potiboard.php.
Search results that were previously displayed with a URL like "search.php?". The URL will be changed like "potiboard.php?mode=search&".

### Externalize and standardize CSS switching part of templates MONO
`templates/mono/parts/style-switcher.blade.php` contains the following parts that have been written in many templates so far.

```
<style>
body{
	visibility: hidden;
}
</style>
<noscript>
	<style>
		body{
			visibility: visible;
		}
	</style>
</noscript>
<link rel="stylesheet" href="{{$skindir}}css/mono_main.css?{{$ver}}">
<link rel="stylesheet" href="{{$skindir}}css/mono_dark.css?{{$ver}}" id="css1" disabled>
<link rel="stylesheet" href="{{$skindir}}css/mono_deep.css?{{$ver}}" id="css2" disabled>
<link rel="stylesheet" href="{{$skindir}}css/mono_mayo.css?{{$ver}}" id="css3" disabled>

```
Also set CSS `visibility: hidden;` here to hide the screen until the DOM and JavaScript have finished loading.
This prevents MONO's color settings from temporarily appearing in a different color scheme.

### Search is not case sensitive

Name searches are now case insensitive when the exact match option is selected.

## [2023/07/08] v5.62.2
### Bug fixes
Search function was not working.
This bug was introduced in v5.58.10 and fixed in v5.62.2.

### From "Tweet button" to "Twitter", "Mastodon" and "Misskey" sharing.

In addition to "Twitter", you can now share posts on short-text posting SNS such as "Mastodon" and "Misskey".

![image](https://github.com/satopian/poti-kaini-EN/assets/44894014/2e28ef1a-5d35-4837-8f6e-169807016823)
  
You can also change it to a conventional tweet button by setting it in config.php.
You can also edit the list of "Mastodon" and "Misskey" servers.

```
/* ---------- SNS share function advanced settings ---------- */

//Include Mastodon and Misskey servers in the share function
// (1: Include, 0: Do not include)
define("SWITCH_SNS","1");

// Servers displayed in the list when sharing on SNS
//Example ["display name","https://example.com (SNS server url)"], (comma is required at the end)

$servers =
[

	["Twitter","https://twitter.com"],
	["mstdn.jp","https://mstdn.jp"],
	["pawoo.net","https://pawoo.net"],
	["fedibird.com","https://fedibird.com"],
	["misskey.io","https://misskey.io"],
	["misskey.design","https://misskey.design"],
	["nijimiss.moe","https://nijimiss.moe"],
	["sushi.ski","https://sushi.ski"],

];

```
If this setting item does not exist in config.php, the above setting will be applied by default.  
If you do not need detailed settings, please use the config.php you are currently using as it is.  

## [2023/05/24] v5.61.2
### Added support for the drawing application tegaki.js.
![230621_tegaki_sukumizu_001](https://github.com/satopian/Petit_Note/assets/44894014/02a75d17-f94a-4e6b-8ec3-8e762d26713e)
### Improved "copy poster name" functionality.
It now add at the cursor position in the text field.
Previously, it was added at the end of the line.

## [2023/06/11] v5.60.0

### Fixed deprecated JavaScript syntax in paint app

- Updated PaintBBS NEO to v1.6.0.
- Updated to original modified version of ChickenPaint.

### The paint app Klecks has two layers at startup.

![Image](https://github.com/satopian/poti-kaini/assets/44894014/23eec76c-969a-458b-931a-2c3bb56e9201)


## [2023/05/20] v5.59.0
### Bug fixes
- Fixed an issue where the URL of the fixed link of the article was not set correctly when the tweet button was pressed.
- This bug was introduced in v5.58.6 and fixed in v5.59.0.

### Updating jQuery
- Updated jQuery from jQuery3.6.0 to jQuery3.7.0.
- jQuery versioning is done inside potiboard.php, so you don't have to change individual templates.
### Fixed deprecated JavaScript and jQuery syntax
- templates/mono_en/js/mono_common.js

## [2023/05/07] v5.58.9.1
- Klecks update
- Blade One update

## [2023/05/03] v5.58.9
- klecks update

## [2023/04/25] v5.58.8
### ChickenPaint update

- Fixed an issue where the canvas aspect ratio was incorrect when ChickenPaint was launched in full screen mode on an iPad.

## [2023/04/13] v5.58.5

### ChickenPaint update
- In order to deal with the problem that the aspect ratio of the drawing area is broken when the orientation of the device is changed on the iPad, we have included a version of ChickenPaint that has been customized and built independently. (Temporary measure until the problem is resolved)
- This issue only occurs when using ChickenPaint in fullscreen mode.
- Therefore, I stopped starting in full screen mode and started in normal mode.
You can switch the display to full screen mode by selecting full screen mode from ChickenPaint's menu bar.

### Improvements

- Fix WCS dynamic palette script's deprecated JavaScript  Rewrote substr() to substring() . 
[String.prototype.substr() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr) MDN

- Added a "Post in the same thread" checkbox.
 
![230307_continue drawing_post in the same thread](https://user-images.githubusercontent.com/44894014/223247562-6184578c-3565-4f43-8a10-2feedd5e46b1.gif)
 
Added a "Post in the same thread" checkbox.
However, in the case of "image replacement", there is no choice but to post in the same thread, so this option is unnecessary.
 
Therefore, I used JavaScript to display the "Post in the same thread" checkbox only when a new post is selected.

- bad host chek 

When a user has the same host name and IP address, we made it possible to specify a few characters from the front of the IP address displayed as the host name and reject it with a prefix match.

>$badhost =["example.com","100.100.200"];

If set like this:

"example.com" will be rejected with a suffix match, and "100.100.200" will be rejected with a prefix match.

## [2023/02/11] v5.56.3

### Updated Klecks to latest version

![Image](https://user-images.githubusercontent.com/44894014/221393538-22d0a2b5-d725-4bc9-9e97-7dd7e15fdf3b.png)

- Dark theme is now selectable.
- Added French language support.
- Fixed touch gesture freezing issue on iPhone and iPad.

### Updated BladeOne to latest version
- Updated BladeOne to v4.8.
### Improvements
- Fixed that the order of the search screen was not in the latest order.
- Improved search screen code.

## [2023/02/09] v5.56.2.2
- Added missing klecks help file.

## [2023/02/05] v5.56.2

### You can now configure whether or not to use the URL input field in config.php.

```
// Use URL input field (Yes: 1, No: 0)
define("USE_URL_INPUT_FIELD", "1");
//No: 0, the URL field disappears from the form input fields.
// Even if the form is faked, the URL will not be entered.

```
In addition to prohibiting the writing of URLs in the text, if you can also make it impossible to write URLs in the URL field, you can eliminate advertisement spam whose purpose is to write URLs.
URL judgment of URL writing prohibition in the text is quite strict, so even if `http://` is omitted, it should be almost impossible to write URL of advertisement spam.

### Fixed an issue where the template could not be sent due to a JavaScript error when the URL or subject fields did not exist.
It's not a bug, but I've rewritten the JavaScript so that it works fine even if the template is modified by the user.

### In PaintBBS NEO, improved so that the screen does not move up and down when manipulating the canvas area such as copy and layer combination.
If the width of the terminal is large compared to the canvas size, it will not scroll even if you grab the mesh of NEO.
This is because the screen moves up and down when copying, layer merging, and Bz curve operations.
However, you can now grab and scroll the mesh when zooming in with pinch zoom.
This is to avoid inoperability.
These are implemented with inline JavaScript in NEO's paint screen, so you'll need to update the paint screen template.

![NEO_issue_230201](https://user-images.githubusercontent.com/44894014/216770678-0e5ab56d-89fa-4f39-8d72-0c71c2b022de.gif)


## [2023/01/19] v5.55.8.5
### Bug fixes
- PaintBBS NEO data was not received at all in the environment of PHP5.6 to PHP7.x. Since it works without causing an error in PHP8.1 and PHP8.2, the discovery was delayed.
Overwrite and update `saveneo.php`.

## [2023/01/14] v5.55.8.2
### Bug fix

Fixed a bug where setting the minimum number of seconds required to draw would cause all alerts that should have been displayed as "15 sec" to be displayed as "0 seconds".
Even if this bug exists, if you set it to 60 seconds, you can post normally when it exceeds 60 seconds.
The problem was that the remaining time was not displayed accurately, and it was all "remaining 0 sec".


## [2022/01/14] v5.55.8.1
### Bug fix

- fixd saveneo.php

Fixed an issue where depending on the content of the error that occurred, it would not be displayed as an alert and the screen would transition and fail to post.

## [2022/01/13] v5.55.8

### Changed communication of PaintBBS NEO from raw data to formData to avoid false positive error by WAF.
- In order to be able to post to the conventional oekaki bulletin board, we modified NEO, which used to send raw data, and made it possible to send header, image, and timelapse animetion data with formData.
With this change, the probability that the conventional WAF will detect NEO transmission data as an attack and block it will be greatly reduced, and the probability of successful posting will be dramatically increased.
[Added an option to send data individually with formData so that WAF does not judge it as an attack. by satopian Pull Request #94 funige/neo](https://github.com/funige/neo/pull/94)
#### Important changes
- Receipt of shi-Painter data is done by `picpost.php` as before.
However, the data of PaintBBS NEO is received by newly added `saveneo.php`.
If you forget to upload this file, you will not be able to post from NEO, so be sure to update it.
Transfer it to the same directory as potiboard.php.
Please update 

- Updated Paint screen template

```
paint.blade.php

```
A parameter has been added to switch to the formData submit mode.

### Changed the config.php

Until now, it was not possible to remove PaintBBS NEO from apps that use it, but now you can choose to use or not use NEO.
If you set it to not use all, it will be a setting that does not use the drawing function.
You can also set it to use only Klecks or only ChickenPaint.
When there is only one app to use, the pull-down menu for app selection disappears and the screen becomes clean.

### Limited by drawing time

For example, if you want to reject submissions with only lines drawn in less than 1 minute,

```
// Security timer (unit: seconds). If not set, use ""
define("SECURITY_TIMER", "");

```
It was possible to specify the minimum required drawing time with , but until now, it was effective only for Shi-Painter and PaintBBS NEO.
With this update, ChickenPaint and Klecks now have this setting enabled.
In the old method, when there was a violation, it was possible to jump to another site (for example, the Metropolitan Police Department site), but instead of that method, an alert will open "Please draw for another 30 seconds.".

## [2023/01/14] v5.55.8.1
- fixd saveneo.php

Fixed an issue where depending on the content of the error that occurred, it would not be displayed as an alert and the screen would transition and fail to post.


## [2023/01/13] v5.55.8

### Changed communication of PaintBBS NEO from raw data to formData to avoid false positive error by WAF.
- In order to be able to post to the conventional oekaki bulletin board, we modified NEO, which used to send raw data, and made it possible to send header, image, and timelapse animetion data with formData.
With this change, the probability that the conventional WAF will detect NEO transmission data as an attack and block it will be greatly reduced, and the probability of successful posting will be dramatically increased.
[Added an option to send data individually with formData so that WAF does not judge it as an attack. by satopian Pull Request #94 funige/neo](https://github.com/funige/neo/pull/94)
#### Important changes
- Receipt of shi-Painter data is done by `picpost.php` as before.
However, the data of PaintBBS NEO is received by newly added `saveneo.php`.
If you forget to upload this file, you will not be able to post from NEO, so be sure to update it.
Transfer it to the same directory as potiboard.php.
Please update 

- Updated Paint screen template

```
mono_paint.blade.php

```
A parameter has been added to switch to the formData submit mode.

### Changed the config.php

Until now, it was not possible to remove PaintBBS NEO from apps that use it, but now you can choose to use or not use NEO.
If you set it to not use all, it will be a setting that does not use the drawing function.
You can also set it to use only Klecks or only ChickenPaint.
When there is only one app to use, the pull-down menu for app selection disappears and the screen becomes clean.

### Limited by drawing time

For example, if you want to reject submissions with only lines drawn in less than 1 minute,

```
// Security timer (unit: seconds). If not set, use ""
define("SECURITY_TIMER", "");

```
It was possible to specify the minimum required drawing time with , but until now, it was effective only for Shi-Painter and PaintBBS NEO.
With this update, ChickenPaint and Klecks now have this setting enabled.
In the old method, when there was a violation, it was possible to jump to another site (for example, the Metropolitan Police Department site), but instead of that method, an alert will open "Please draw for another 30 seconds.".


## [2022/12/30] v5.52.8

### It is now possible to extract the width and height from the old Java version pch file and load it into the canvas.
All apps no longer require canvas size input when uploading an app specific file and loading it into the canvas.

![221227_006](https://user-images.githubusercontent.com/44894014/210079467-e7e3d80b-cf15-4dc1-8cb2-89dfc3f52800.gif)


## [2022/12/28] v5.52.2

### Improved. PaintBBS NEO animation file upload painting made easy.
-  It has become easier and more convenient to upload and paint PaintBBS NEO and Java Shi Painter videos from the administrator screen.  
Until now, it was necessary to specify the canvas size before loading the pch animation file into the canvas.  
With v5.52, you can now automatically get the canvas size from the animation file.  
However, it is necessary to specify the canvas size when uploading the animation file of the Java version of PaintBBS.  
For HTML5 version PaintBBS NEO, you can automatically get the canvas size when uploading animation files.  

![221227_005](https://user-images.githubusercontent.com/44894014/209773098-d83a702f-dd79-49e8-9030-c2cdedee266b.gif)
↑  
This is a GIF animation created to introduce the operation when uploading files in specific formats for shi-Painter, PaintBBS NEO, Klecks, and ChickenPaint from the administrator screen.  
The canvas size is still 300x300, but the canvas is open at its original size.  
If you can download a PSD file, why not upload it? Including the meaning of the explanation for those who were wondering, I also uploaded the ChickenPaint `.chi` file and the Klecks `.psd` file (Photoshop format). I created this GIF animation for description.  

## [2022/12/24] v5.51.0
- PaintBBS NEO update v1.5.16
- Solved the problem that cookies could not be read with JavaScript when WAF (Web Application Firewall) was turned on.
If WAF is turned on, cookies are encrypted and have the httpOnly attribute.
POTI-board uses JavaScript to load cookies into static HTML files.
Therefore, with the conventional POTI-board, it was not possible to read the cookie of the form input content when the WAF was turned on.
I solved this problem by issuing a form input cookie not only in PHP programs, but also in JavaScript.
However, it is safer to use httpOnly cookies, which prevent JavaScript from reading the cookie.
There is also a drawing board that uses httpOnly cookies.
[satopian/Petit_Note_EN: Petit Note English ver.PHP script for PaintBBS,ChickenPaint, and Klecks PHP5.6-PHP8.2](https://github.com/satopian/Petit_Note_EN)
Log conversion from POTI-board is also possible.
[satopian/PetitNote_plugin: Petit Note Plugin for Drawing Board](https://github.com/satopian/PetitNote_plugin)

- Adding JavaScript to HTML files to emit cookies for form inputs increases the number of lines of inline JavaScript.
So I externalized my JavaScript.
This externalized JavaScript also includes the back to top button JavaScript and the Luminous image popup JavaScript.
We apologize for the inconvenience and the need to update templates frequently.
A directory for JavaScript has also been added, such as `templates/mono_en/js/`.
Please note that if you forget to upload this directory, things like the back button that appears when you scroll down or the JavaScript that appears on the same screen when you click on an image will not work.
Overwrite everything in the `templates/` directory if you haven't customized the templates.
Just upload all new installations.

## POTI-board EVO v5.50.11 release
## [2022/12/21] v5.50.11

### Improvements

- Changed the format of the canvas size pull-down menu formula generation loop to prevent XSS.
- Removed self-closing tag due to warnings when checked by [W3C Markup Validation Service](https://validator.w3.org/).
- Add same-origin check. Illegal posts from different origins are now rejected.
However, for browsers that do not support Orijin headers, such as Edge's IE mode, Orijin headers are not checked.
This is because if this check becomes mandatory, it will not be possible to start the shi-painter using Java.
CheerpJ, for example, cannot smoothly play Shi-Painter's drawing animation, so Java must be started.
- Protection against directory traversal attacks. Invalidate hierarchies such as `../../` in basename() when variables are entered in fopen().
- Rejection when the password is incorrect 5 times in a row.
If you enter the wrong administrator password five times in a row, you can now refuse to enter it any more.
If you want to use this function, please add the following setting items anywhere in config.php.

> /*safety*/
> 
> //Reject if admin password is wrong for her 5 times in a row
> // (1: Enabled, 0: Disabled) 
> // 1: Enabled for more security, but if the login page is locked it will take more effort to unlock it.
> 
> define("CHECK_PASSWORD_INPUT_ERROR_COUNT", "0");
> 
> // Access via ftp etc.
> // Remove the `templates/errorlog/error.log` and you should be able to login again.
> //This file contains the IP addresses of clients who entered an incorrect admin password.
> 

- Changed the method to get IP address and host name because some servers cannot get IP address with getenv().
- Use uniqid() to emit user-code repcode. It now changes in micro time units.
- Increased the replacement code length from 8 to 12 characters.

- Added original error message for WAF false positive to PaintBBS NEO.

![Screen-2022-12-21_14-34-31](https://user-images.githubusercontent.com/44894014/208915842-51352610-9abc-46b1-b4c1-8403a51bb573.png)


## [2022/11/30] v5.36.8

### update
- Updated Klecks.
- Fixed brush shortcut key behavior.
Updated BladeOne to v4.7.1.

### improvement
- Even if the timestamps used in the working files overlap, advance the post time by 1 second so that the timestamps do not overlap.
Previously, the working file could be overwritten by another file.

- An error does not occur when the post time to be compared is in the future.
In the post waiting time calculation process, even if the post time after the current time is detected, it will not be an error.
For example, if the posting time is delayed by one year due to some mistake, the next posting will not be possible until one year has passed. To avoid this, if the waiting time is a negative value, it will pass without generating an error.

- BladeOne v4.7.1. Along with that, I changed potiboard.php to automatically generate the cache directory.
The cache directory auto-generation feature has been removed from BladeOne. As an alternative function, added a cache directory auto-creation function to potiboard.php.

- Change the permission of files that need to be written in advance to 0606 (606). The log file that cannot be viewed externally is 0600 (600).

- The types of error messages have increased when posting OEKAKI images fails.

## [2022/10/29] v5.35.3

### Improvements
#### Template Common
- When you click the image file link on the management screen, it now pops up with luminous.
Previously, images were opened in separate tabs.
- Corrected [tweet] to [Tweet].
- Corrected [TOOL] to [Tool].

#### Template MONO
- Added back to top page function that is displayed when scrolling to template MONO.
- Display optimized for smartphones. If the resolution is iPad (768px) , unfloat the image. Set the image margins to 0.
As a result, the left and right margins of the image displayed on the smartphone are the same.
Previously, the margin on the right side of the screen was larger.
・The administrator can now edit the article by clicking the article number on the MONO administrator deletion screen.

### Security

- If the script content of CheerpJ Applet Runner has been tampered with by hacking, etc., it will be detected and the script will not be executed.
[Subresource Integrity](https://developer.mozilla.org/en/docs/Web/Security/Subresource_Integrity) See MDN.
If you change the version of CheerpJ, it will not work unless you change the hash value.
However, the calculated hash value is included in the latest version of potiboard.php
・If the image file received by picpost.php, which receives data from the Shi applet or PaintBBS NEO, is not  jpeg, png, etc. image, it will be judged as illegal and deleted.

### When using Shii applet and PaintBBS NEO, the behavior of rejection due to the time required for drawing or the number of steps required has been changed.

・shi-chan has developed a function to redirect the drawing screen to the police site when the drawing time is short or the number of drawing processes is small.
However, this feature was impractical and of no use.
Therefore, instead of suddenly jumping to the specified URL from the drawing screen, we changed the specification to display an alert on the drawing screen that "drawing time is too short" and "the number of steps is low".
  
![221027_002 Issue an alert when the NEO drawing time or number of processes is insufficient. ](https://user-images.githubusercontent.com/44894014/198825566-dc572087-a49a-4ec4-b79b-4d0bdaa18c04.gif)

### Compulsory thumbnail function is back
- Restored the force thumbnail feature that was in v1.3.
Using the latest `thumbnail_gd.php` turns this feature on.
If the file size exceeds 1MB, a thumbnail image in jpeg format will be output.
Assumed case. If a GIF animation image file that is small in height and width but large in file size exceeds 1 MB, a thumbnail image in JPEG format will be displayed instead of the GIF animation.
Click the image to view the original GIF animation.

### others
- Changed the initial error message to switch automatically between Japanese and English.
- Reduce load by avoiding unnecessary processing. For example, if there are no comments, you don't have to check the length of the comment or the bad words, so returning immediately reduces the load.

### update Klecks
Fixes an issue where white fills after using distortion tool show lines that follow the shape of the Liquify.
Added how-to video link to help page and added gradient shortcut keys section.

## [2022/10/03] v5.26.8

### Updated ChickenPaint to the latest version.

![ChickenPaint_Chrome106_bug](https://user-images.githubusercontent.com/44894014/193561979-a99928d2-5e4d-4265-8e20-1f42cb630599.gif)

The attached image is a GIF animation when I did a reproduction test of the problem that the color picker is not displayed.
Updated to the latest version of ChickenPaint to avoid a bug in Google Chrome 105,106 that causes this problem.

### Updated klecks to the latest version.

- Added option to use gradient tool as an eraser.
- Added vanishing point filter.

### Display images using luminous.

![luminous](https://user-images.githubusercontent.com/44894014/193562309-209f2623-0969-4726-8285-203932641057.gif)


## [2022/09/20] v5.26.3
### Update
- Updated Klecks to latest version.
Gradient tool and pattern filter added.
- Updated BladeOne to v4.6.
### Bug fixes
- Fixed a bug that an E-WARNING level PHP error occurred when specifying an article number other than the article number of the thread's parent on the reply screen.
Please update `potiboard.php`.
### Improvements
- If the password field is blank for password authentication when drawing a continuation or download authentication of pch, chi, psd, the cookie password will be used instead.
Unified to the same behavior as password authentication during edit function.  
- Fixed function `check_password()` for password checking. Password authentication will not succeed if no password is entered and the password is not present in the cookie.  
- Fixed the multilingual support of the mail notification function was insufficient.
- Increased page number spacing for template MONO.
- Fixed paint screen's clock javascript .
- Changed the unit of file size on the managed post screen from bytes to kb.

## [2022/08/16] v5.23.8
### Update
- Updated Klecks to the latest version.
Added noise filter.
  
![image](https://user-images.githubusercontent.com/44894014/184852762-85d62967-63b4-41bd-b857-eec9d9cc63d4.png)

- Updated BladeOne to v4.5.5.
- Updated jQuery to v3.6.0.
Since the existence of the file is checked, the program will not run if the included jQuery does not exist.
The  case an error message telling you that the file does not exist.

### Improvements
- Fixed clickjacking vulnerability.
It will not be possible to display in frames or iframes.
It's more secure, but I know some people want to display it in a frame.
Therefore, we added a new setting item to config.php so that you can select whether or not to display it in the frame.
If you do not need to display in the frame, you do not need to add setting items.
```
// Deny display in iframe:  (1: Deny, 0: Allow)
// We strongly recommend "Deny" to avoid security risks.
define('X_FRAME_OPTIONS_DENY', '1');

```
I think it is difficult to rewrite config.php from scratch, so if you add the above setting items anywhere, you will be able to display it in the frame.

- Improved mobile usability.
Optimized tap target size and spacing.

- Improved page loading speed
Prefetch externally loaded JavaScript such as jQuery and loadcookie.js to avoid rendering blocking.
- JavaScript execution timing to `DOMContentLoaded`.

- Fixed a fatal error if not written carefully. error() function to built-in function die().
  
- Enabled to change the jQuery version without touching the template directly.
- Added width and height of image in search screen.
- In order to speed up loading speed, loading="lazy" is not applied to the range displayed from the beginning.
- The JavaScript description of the timer under the PaintBBS startup screen was deprecated, so it has been fixed.
[After setting the content security policy, the clock on the drawing screen of POTI-board stopped working. ｜Satopian｜note](https://note.com/satopian/n/n7b757ee05975)

## [2022/07/11] v5.20.2
### Improvement
- Reduced the probability of duplicate file names when posting drawing images to 1/1000.
- Even if it is duplicated, 1 second will be added to the posting time.
- Add a process to check if there is a posted image, make sure that the drawn image is sent to the server, and then move from the drawing screen.
### Update
- Klecks has been updated. Added a grid to the editing function.
- BladeOne has been updated. A minor bug has been fixed.

[Release POTI-board EVO EN v5.20.2 released.](https://github.com/satopian/poti-kaini-EN/releases/latest)

## [2022/06/30] v5.19.1
- Since it was confirmed that it does not work with PHP7.1, the required operating environment has been changed to PHP7.2 or higher.
In the PHP7.1 environment, it will not start and will issue an error message telling you that the PHP version is low.
- The form is not displayed when there is no unposted image.  


## [2022/06/11] v5.18.25
### Bug fixes
- Fixed the issue that the layout was broken when posts omitted .

### Improvement
- ChickenPaint now launches in full screen.

More information can be found in the release.    

## [2022/05/25] v5.18.9
### Klecks update
Updated Klecks to the latest version.
### CheerpJ update to v2.3
Updated CheerpJ, which converts Java applets to JavaScript when using the painter, to v2.3.
### Bug fixes
 - Fixed a bug that the rejected character string and rejected url for anti-spam could not be processed correctly if they contained `/` (slash).
 - Fixed a minor error when calculating the number of days elapsed for deleting temporary unnecessary files.
 - Fixed the problem that the date and time when closing the reply in the specified number of days was not the parent's posting date and time but the latest reply posting date and time.

### Improvement
- Reimplemented tripcode function.


## [2022/04/28] v5.16.8

### Klecks has been updated.
- Several issues with the iPad OS have been fixed.
- Traditional Chinese has been added to the available languages.

### The template engine BladeOne has been updated.

- BladeOne has been updated to v4.5.3.

### Improvement

- If the cause of the transmission failure of klecks is a server error, the error number is displayed as an alert.
For example, if `saveklecks.php` does not exist ," Error 404 "will be displayed in the alert.

- Changed the working directory of the PNGtoJPEG process to `TEMP_DIR`.
Even if the process fails and the working files are left behind, they are now automatically deleted over time.

### Bug fixes
- When the `.pch` save directory was specified other than`'src /'`, the automatic directory creation function did not work and the required files could not be saved.
Changed to be created automatically when the directory does not exist.


## [2022/04/02] v5.16.5.1
- fix search template.
- fix main template.
Fixed a grammatical error in the HTML of the search screen.
- Corrected incorrect English notation.
- klecks updated
The number of layers that can be used has been increased from 8 to 16.  


## [2022/03/25] v5.16.5

### Improvement
### Klecks Japanese translation
![image](https://user-images.githubusercontent.com/44894014/160145766-395c519f-e90e-4397-a92e-03005648906e.png)

- Translated Klecks into Japanese.
I was able to bundle a Japanese version with POTI-board.
This new version of Klecks will automatically detect your browser's language priority and switch languages ​​for you.
You can also specify the language to use regardless of the browser language setting.
You can select English, German, or Japanese.
Chinese is only in Simplified Chinese and details are still in English.
Japanese translation resources have already been merged into the klecks repository.

### The download button for the application-specific file has been created.
![image](https://user-images.githubusercontent.com/44894014/160227733-b57a5783-d95a-4648-b484-5e065b2b7402.png)

#### App-specific format list
- `. Pch` file (PaintBBS)
- `. Chi` file (ChickenPaint)
- `. Psd` file (Klecks)

The file containing the layer information for Klecks is a `.psd` file in Photoshop format.
The downloaded `.psd` file can be opened by CSP, SAI and many other apps.
`.pch` and` .chi` can be opened with NEO and ChickenPaint, respectively.
If you attach `.pch`,` .chi`, `.psd` from the administrator posting screen and press the paint button, you can load it on the canvas and post it.

#### Transparent PNG, change the transparent part of the thumbnail of transparent GIF to white

- Fixed the problem that the transparent part of transparent PNG was black when it was converted to JPEG.
It is not a mistake that the transparent color is black, but since it often results in unintended results, when converting from transparent GIF or transparent PNG to JPEG, the transparent color is converted to white.

### Bug fixes

- Fixed the case where a minor error occurred when operating the upload format specific to the paint application used when logging in to the administrator, and the automatic deletion function of unnecessary temporary files such as pch, chi, and psd.
### BladeOne update
Updated template engine BladeOne to v4.5.

## [2022/03/12] v5.12.0
### Bug fixes
- Fixed the issues that the menu could not be operated with Apple Pencil.
Fixed that the menu operation of ChickenPaint and Klecks could not be operated with.
It was caused by Javascript added to the paint related template in v3.19.5.
I deleted the corresponding Javascript and confirmed that it works normally.
### Updated Klecks
- Updated Klecks to the latest version.
A new brush has been added. You can now do mirror painting.

## [2022/03/8] v5.10.0

### new function
- You can use the new painting app Klecks.

![image](https://user-images.githubusercontent.com/44894014/157234120-d806d24f-2f2b-4600-9d29-515a5743efd6.png)

Easy-to-understand UI, powerful brushes, and filter functions.
You can use 8 layers.
### fix
Many minor bugs have been fixed.

## [2022/02/10] v5.05.0

### URL blacklists
When the character string specified by the "String blacklists" exists in the URL, it is now rejected.
In addition, we have added a "URL blacklists" .

```
// URL blacklists
$badurl = array("example.com","www.example.com");

```

Previously, no spam word checking was done on the URL.

### Older threads don't show links to draw more. Do not allow the continuation to be drawn.

There was a function to lock the editing of articles that exceeded the specified number of days, but I was able to draw the continuation.
I created these settings because the article will be modified if the password is compromised by a third party.
Even if the article is locked, it can be deleted by the user.
In addition, the administrator can edit even after the specified number of days.

However, I think that some people may be in trouble if the lock is applied within a certain number of days.

`define ('ELAPSED_DAYS', '365');`

Threads older than 1 year will be locked in `365`,

`define ('ELAPSED_DAYS', '0');`
  
If set to `0`, it will not be locked.

- If the specified number of days has passed while drawing, it will be a new post.
Also, when the thread is deleted while drawing, it will be a new post.

## [2022/01/27] v5.01.03
### Change to BladeOne for template engine

I changed the template engine to BladeOne because I get a deprecated error from Skinny.php in PHP8.1 environment.
However, that means that the templates will be incompatible.
Templates with the extension `HTML` have been replaced with templates with the extension `blade.php`.
When you open the content, it's not much different from a traditional template. However, it may seem difficult because the extension is not HTML. 

### What has changed due to the change of the template engine
#### PHP7.4
- I was developing it to work in PHP5.6 environment, but I found that v4.2 of BladeOne only works in PHP7.4 or higher environment.
POTI-board EVO v5.x requires PHP 7.4 or higher.

#### Information for those who customize and use templates.
The thread display process has changed significantly.
Previously, there was processing for the parent of the thread, and there was separate processing for reply.

In v5.x, the loop of the array of one thread is ended at once.

It then treats the first loop as the parent of the thread.
Specifically, it looks like the following.

```
	@foreach ($ress as $res)
	 {{-- Parent article header -}}
	@if ($loop->first)
	{{-- First loop -}}
	<h2 class="article_title"><a href="{{$self}}?res={{$ress[0]['no']}}">[{{$ress[0]['no']}}]
			{{$ress[0]['sub']}}</a></h2>

	@else
	<hr>
	{{-- article header for reply -}}
	<div class="res_article_wrap">
		<div class="res_article_title">[{{$res['no']}}] {{$res['sub']}}</div>
		@endif

```

`@if ($loop->first)` is true for the first loop of the thread.
When `@if ($loop->first)` is true, it is processed as the parent of the thread.
The `<h2>` tag of the title that is displayed differently only when it is the parent of the thread is put in that place.

If you install the extension [laravel-blade](https://marketplace.visualstudio.com/items?itemName=cjhowe7.laravel-blade&ssr=false#review-details) in a free editor called VScode, the editor screen will appear. Switch to a color scheme optimized for the blade syntax.
Both the extension and the editor itself can be used free of charge.
### Files that have changed
all.
## Looking ahead for a few years
We apologize for the incompatibility of the template and the resetting of config.php, but we hope you understand it.

Also, please use the PHP script for the Oekaki bulletin board called [Petit Note](https://github.com/satopian/Petit_Note), which was newly recreated from scratch.


## [2021/12/22] v3.19.5

- Added the ability to display images of the next and previous threads in the reply view.  

![image](https://user-images.githubusercontent.com/44894014/147068447-9fda9fbe-bfbe-473a-b318-72be33f54273.png)

  
- When you continue from the Reply image with a "new post", that image becomes the Reply image.  
Previously, if you continue and draw from the image of Reply, a new thread was created.  

- After replying, the screen of each thread that replied is now displayed.
Previously, the top page was displayed regardless of where you replied to the thread.
- Changed the display method when editing / deleting in reply mode or catalog mode and completing the work.
For example, when the edit / delete work is completed on the second page of the catalog mode, the second page of the catalog mode is displayed.
Until now, the top page was displayed.
- Individual threads are now displayed when you continue drawing and the post is complete.
Until now, the top page was displayed.
If the image you want to continue is many pages away from the top page, you had to find the image from many pages.

- ChickenPaint Swipe a specific part of the screen to prevent it from moving up or down. The relevant parts are controlled by JavaScript.  
  
## [2021/12/04] v3.15.3

- Updated index.php required for new installations.  
Even if the PHP version is PHP5.3 or lower, an error message will be displayed indicating that it will not work because the PHP version is low.  
Previously it was a fatal PHP error.  

- Fixed an issue where long press the ChickenPaint's palette with the pen would open an unwanted mouse right-click menu.

- Fixed an issue where the screen would move up and down when copying and layer merging with PaintBBS NEO.  
If you select a rectangle to perform a copy and layer combination operation, the pen may protrude slightly from the canvas.  
At this time, the PaintBBS NEO's canvas may move up and down.  
Occurs when using Windows ink or Apple Pencil.  
If a screen width wider than the iPad is detected, the screen will not move even if you swipe the mesh part around the canvas of PaintBBSNEO.  
When using a smartphone, the operation is the same as before. Because if you want to pinch out the canvas and zoom in,If you cannot swipe, you cannot operate.    

Please update `mono_paint.html` to resolve these issues.

- picpost.php
Fixed false positives for languages.

- Many translations have been improved.

## [2021/11/23] v3.15.2
### Updated contents of `potiboard.php`

- Chi file deletion process after upload painting  
I added it because there was no process to delete the chi file after uploading the ChickenPaint-specific file and the chi format file and loading it on the canvas in the administrator's post.  
This fix removes it from the temporary directory 5 minutes after uploading. Prior to this fix, files that were no longer needed were deleted after a few days.  
- The HTML ALT for images has been fixed. The HTML translation of the theme has been improved.  


## [2021/11/16] v3.12.2

### `potiboard.php` updates

- Fixed the calculation method of the width and height of the thumbnail image and the width and height of the HTML image when drawing the continuation.
The setting value of connfig.php is set as the maximum value and the calculation is restarted from the beginning.
In ChickenPaint, you can change the height and width of the image by rotating it, but until now, the size of the thumbnail image became smaller each time it was rotated.
- The actual canvas size is now set in the cookie. Previously, the value entered by the user was set as is. Since there is a maximum value for the canvas size, for example, when the maximum is 800px, even if you enter 8000px, the actual canvas size that opens is 800px.
Previously, the cookie was set to 8000px even in such cases.
- An error is now returned when a file name with an invalid length is entered.
- Checks the length of the reply number and returns an error if the length is incorrect.
- Fixed the specification that the full text of the parent's comment is displayed in the description of the article displayed on the reply screen, and now omits 300 bytes or more.
- The translation has been improved.

Please update `potiboard.php`.
### `picpost.php` and `save.php` updates
- In order to mitigate unauthorized posting from external sites, the usercode set in the usercode and cookie during post processing is now checked.

Please update `picpost.php` and `save.php`.

## [2021/10/31] v3.10.1 
- Added password length check. 
- Moved the length check of each input item to the first half of the process.

Fixed a minor error that occurred when displaying the management screen.
The file needed to fix this issue is potiboard.php.
Please update `potiboard.php` by overwriting.

## [2021/10/30] v3.10.0 Fixed a serious bug

- All versions of POTI-board prior to v3.09.5 have a serious bug.  
You may lose all log files.

For those who are using POTI-board v2.  
You cannot use all the functions of v3 system just by replacing `potiboard.php`, but you can deal with this problem.  

Please update `potiboard.php` by overwriting.

### [2021/10/27] v3.09.5

- To prevent the use of weak passwords, an error message will be displayed when the password is 5 characters or less. The error message is "Password is too short. At least 6 characters."
- In order to prevent tampering with articles by third parties, the function to lock replies to threads older than the set number of days has been expanded to lock editing of old articles.
You can delete it. In addition, the administrator can edit and delete as before.

- If you used the old config.php that doesn't have the following settings, you had to check or uncheck [no_imane].  
>// Use to the checkbox of [no_imane], do:'1', do not:'0'  
define('USE_CHECK_NO_FILE', '0');  

we changed this default value from "do:'1'" to "do not:'0'".  
Previously, even if you were using a new theme HTML file, you had to check or uncheck "[no_imane]" when the version of config.php was old.  
- Changing the copyright link on the site. [https://paintbbs.sakura.ne.jp/poti/](https://paintbbs.sakura.ne.jp/poti/)


### [2021/09/28] v3.08.1.1

- Fixed a bug in POTI-board EVO v3.08.1.  
There was a problem switching the color scheme of the theme MONO because the necessary JavaScript was accidentally deleted.

### [2021/09/28] v3.08.1
#### bug fixes
- Fixed an issue where the submit button was not enabled when using the browser's "History Back" or error screen "Back" links.  


### [2021/09/28] v3.07.5
#### Minor bug fixes

 - Fixed the processing specification that determines whether to start the drawing time calculation.
 - Even if an error occurs during the posting process, you can repost the drawing image from the unposted image. Moved work file deletion to almost the end of the post process. Previously, if an error occurred in the second half of the posting process, the posted illustration would remain on the server but could not be displayed on the bulletin board.

#### Improved UI UX

 - Linkd from thread title to reply screen.

Click the thread title to open the reply screen .

 - The color scheme of the search screen is closer to that of the bulletin board.


#### Improved auto-complete for Chrome and Firefox

When editing or deleting an article, if you enter the article number and press the edit button, the password may be saved as a set with the user name as the article number.

### [2021/08/22] v3.06.8 lot.210822

- The chickenpaint icon has been updated

- Changed the color scheme of the theme MONO  
Change vivid color to pastel color.

- Fix garbled characters  
Fixed the problem that the character string posted on the Twitter screen when the Tweet button was pressed was garbled.  
Fixed garbled characters in post notification emails.  
- Administrator deletion screen  
Improved security. Strengthened XSS measures.  
Changed the number of items displayed on one page from 2000 to 1000.
- Fixed error message  
"chi" has been added to the description of supported formats because you can use "chi" files for the ability to upload files and load them onto the canvas.

2021/08/23 Due to my mistake, there was no new icon for chicken paint.  
I apologize for any inconvenience, but please overwrite and update the ChickenPaint directory.  
It has been fixed in (v3.06.8.1).  

### [2021/08/11] v3.05.3 lot.210811
- Added decoding process because Tweet and notification emails are HTML-escaped garbled characters.
- Added output variables corresponding to the title and name used for Tweet.
#### Information for theme authors
`<% def(oya/share_sub)><% echo(oya/share_sub) %><% else %><% echo(oya/sub|urlencode) %><% /def %>`    
`<% def(oya/share_name)><% echo(oya/share_name) %><% else %><% echo(oya/name|urlencode) %><% /def %>`  
If the version of the POTI board itself is low and the newly added variables are undefined, use the variables for the old Tweet.  
When a newly added variable is defined.  
Use a new variable.  

### [2021/08/06] v3.05.2.2
- ChickenPaint has been updated to fix many iOS related bugs. Bugs related to palm rejection have been resolved.  
You can now recognize your palm and Apple Pencil. Until now, unintended straight lines have occurred.  


### [2021/08/03] v3.05.2 lot.210803
- Resolved an issue where using ChickenPaint on an iPad would cause unintended double-tap zoom issues that would make drawing difficult.  
Please update the HTML for Paint screen.
- `<img loading = "lazy"> `. Added `loading =" lazy "` to the `img` tag of theme.


### [2021/07/18] v3.05.1 lot.210616
- CSRF measures using fixed tokens have been introduced. You can reject unauthorized posts from outside the site.  
If the theme HTML does not support tokens  
`define('CHECK_CSRF_TOKEN', '1');`  
To
Change to   
`define('CHECK_CSRF_TOKEN', '0');`.
If you enable this setting when the theme is not supported, you will not be able to post.
If this setting is not present in `config.php`  
`define('CHECK_CSRF_TOKEN', '0');`  
Is treated the same as.
- Moved to the method of checking HTML at the time of output.  
Administrators can no longer use HTML tags.  
HTML tags that have already been entered will be deleted.  
The output is the HTML tags removed and escaped.  
- The form on the top page and the mini-less form displayed in each thread have been abolished.  
This is because you cannot set the CSRF token in a static HTML file.  
- ChickenPaint is now available on your smartphone.  

### [2021/08/03] v3.05.2 lot.210803
- Resolved an issue where using ChickenPaint on an iPad would cause unintended double-tap zoom issues that would make drawing difficult.  
Please update the HTML for Paint screen.
- `<img loading = "lazy"> `. Added `loading =" lazy "` to the `img` tag of theme.

### [2021/06/17] v3.02.0 lot.210617
- Addressed an issue where the Chicken Paint screen would be selected.
- Prevents returning to the previous screen with Windows ink and two-finger gestures when drawing with PaintBBS NEO and shi-Painter.
- Changed CSS switching to pull-down menu method.

### [2021/06/05] v3.01.9 lot.210605
- Updated to the latest version of "ChickenPaint".  
If the browser language is other than Japanese, it will be displayed in English. If the browser language is Japanese, it will be displayed in Japanese.
- Management screen paging Page breaks in units of 2000.  
Improved paging on the main page and catalog page.  
Shifted to a method of paging in 35-page units.  

- Addressed the version of CheerpJ where the "shi-painter" does not start.  
The JavaScript url required to start CheerpJ is managed in potiboard.php.  

### [2021/05/15] v3.00.1 lot.210514
- Chicken Paint is now available.
- The name of the script has changed to POTI-board EVO.
 
### [2021/04/22] v2.26.7 lot.210403

Change the working directory of png2jpg to the real path of src. The behavior is the same as before it was made into a function.

### [2021/03/02] v2.26.6 lot.210320.0

- Corrected English translation of `config.php`.
- Fixed an issue where images were not displaying as intended in the theme.

### [2021/03/09] v2.26.5 lot.210308.0

- Fixed a mistake in v2.26.5 regarding email addresses (by satopian)

### [2021/03/07] v2.26.3 lot.210306.0

- Fix E_WARNING level error when posting a response with no destination (by satopian)
  - Fixes writing process to `img.log` not to occur in a different way from POTIv1.33b1.
- Fixed that fopen() of user deletion was not closed.
- Fixed a bug in the administrator's delete screen (by satopian)
  - Email addresses are now passed through a validation filter, and those with invalid email formats are not sent to links.
  - Fixed a bug where MD5 was not displayed.

### [2021/02/17] v2.26.2 lot.210217.0

- Fixed an E_WARNING level error (by satopian)
  - Fixed an error where the rightmost tab of the tab separator was trimmed and the tab character was also lost.
  - In `config.php`, when `$badfile` is not set, E_WARNING level error occurs, so I made sure it is defined and is an array before processing. If config.php is set up correctly, there is no problem.
- There are changes in `potiboard.php` and `picpost.php`.

### [2021/02/15] v2.26.1 lot.210215.0

- Fixed a bug that when a mail or URL in the log is not in the correct format, it is checked when outputting and not sent out as a link (by satopian)
- The form() function used to be called for the number of HTML pages when updating the HTML of an article, but now it is assigned to a variable so that it can be called only once (by satopian)
  - The difference is so slight that you can't tell.

### [2021/02/13] v2.26.0 lot.210213.0

- Fixed XSS vulnerability in v2.23.1 lot.210203 (by satopian)
  - This is quite dangerous, so please make sure to update.
- Fixed a character string that could not be set in cookies (by Satopia)

### [2021/02/13] v2.23.9 lot.210212.1

- Added support for setting error messages when uploading pch files in template_ini.php (by satopian)

### [2021/02/12] v2.23.8 lot.210212.0

- Fixed an error when the administrator password is undefined (by satopian)
- Fixed a bug that a string to restrict only in admin mode was rejected in normal writing (by satopian)
  - There is an additional message in `template_ini.php` of theme.

### [2021/02/12] theme MONO-en

- Changed the English translation of the palette buttons a little bit (by sakots)
  - overwrite `mono_paint.html` , `template_ini.php` .

### [2021/02/10] v2.23.7 lot.210210.0

- Fixed error message displayed when administrator password is undefined (by satopian)
  - There is an additional message in `template_ini.php` of theme; Reserveed MSG040.
- Fixed the problem that the string to restrict only in admin mode is rejected even when writing normally (by satopian)

### [2021/02/09] v2.23.6 lot.210209.1

- Fixed vulnerability in admin rights when config is under certain conditions (by satopian)

### [2021/02/07] v2.23.3 lot.210207.0

- Fixed cookie errors (by satopian)
  - Please overwrite and update `loadcookie.js`.

### [2021/02/06] v2.23.2 lot.210204.0

- Rewind to v2.23.2 due to operability issues found due to multiple sending of sessions.
  - You can use the theme as is.
  - v2.25.0 will be developed while looking for a way to solve the problem.

### [2021/02/05] v2.25.0 lot.210205.0

- Changed to use session and one-time token when posting and editing by administrators (by satopian)
  - The old method of authenticating by putting the admin password in the hidden field has been abandoned, and the security has been improved because the admin password is not shown in the HTML file source.
- Update the theme MONO (by sakots)
  - Discontinue use of Font Awesome and use svg files for icons.
  - Changed the image size input method from a pull-down menu to a numerical input method.
  - Support for pch upload painting in admin posts.

### [2021/02/03] v2.23.1 lot.210203.0

- Fixed not to create a link unless the correct character string is entered as an email address in the email field (by satopian)
- Fixed remained Japanese message that should have been replaced with a constant (by satopian)
- Fixed a large number of blank lines in the log file when the number of log holdings is exceeded (by satopian)
- Fixed double cookie encoding (by satopian)
- Fine-tuning the source code of `picpsot.php` and `thumbnail.php` (by sakots)
  - The function itself has not changed.

### [2021/02/02] v2.23.0 lot.210202.0

- Not to do use variables that can be obtained with filter_input() as function arguments (by satopian)
- To be a function of input check (by satopian)
- Tuning the source code (by satopian)

### [2021/01/30] v2.22.6 lot.210130.0

- Move `picpost.systemlog` settings to `picpost.php` (by satopian)
  - Please overwiter `picpost.php`. Fixed a mistake in moving the settings.
- Fine-tuning the source code (by sakots)

### [2021/01/27] v2.22.5 lot.210127.0

- Fine-tuning the source code (by satopian)

### [2021/01/26] v2.22.3 lot.210126.0

- Fixed a bug that sometimes displayed as "0 response(s) Omitted." (by satopian)
- Fixed minor error in php8 environment (by sakots)

### [2021/01/18] search.php

- Fixed a bug that caused a fatal error in PHP8 environment (by satopian)
- Fixed a bug that it cannot be processed when the log for one statement is 4096 bytes or more (by satopian)

### [2021/01/07] theme/template_ini.php

- Improved English translation

### [2021/01/05] v2.22.2 lot.210105.0

- Multilingual support of NOTICEMAIL (by satopian)
  - The settings exist in `theme/template_ini.php`.

### [2021/01/02] v2.22.1 lot.210102.0

- Avoid fatal errors in php8 when the timestamp doesn't exist in the log. (by satopian)

### [2021/01/01] picpost.php

- The permissions of `picpost.systemlog` can be set in `config.php`. (Leakage of previous work)

### [2020/12/25] LICENSE

- Revised LICENSE by sakots.
  - I misunderstood the "inheritance" of CC BY-NC-SA 3.0.

### [2020/12/24] v2.22.0 lot.201224.0

- Sort config items according to importance (by satopian)
  - The error log settings in picpost.php have been moved to potiboard.php. It is a setting item for developers.
  - You don't have to modify config.php. Sometimes we might add new settings in the config file. When that happens, these should be changed only when it's necessary. Otherwise they should work as they are.

### [2020/12/23] config.php

- About rejected character. [Click here for details](https://github.com/sakots/poti-kaini-EN/pull/10)

### [2020/12/22] v2.21.6 lot.201222.0

- Multilingual support
  - All messages output by potiboard.php can now be set in template_ini.php. (by satopian)
- Fixed a bug where constants are defined twice (by satopian)
- Enabled to set the timezone in config.php (by satopian)
- Removed wondercatstudio 'http' from copyright notice for safety. (by sakots)
  - Because someone else has taken the domain.

Replace `potiboard.php` `picpsot.php`. Add settings to `config.php` `theme/template_ini.php`.

### [2020/12/22] theme/template_ini.php

- Improved translation (by satopian)

### [2020/12/21] search

- Translated. (by satopian)
  - `search.php` and `theme/search.html`

### [2020/12/21] theme -> mono_main.html

- "-san" (by satopian)

### [2020/12/21] config.php

- Update translation of config.php (by aaroncdc)

### [2020/12/20] v2.21.2-en

- Fixed fatal error when the posting time (UNIX timestamp) was not recorded in the log file. (by satopian)
- Improve English config descriptions (by Craftplacer)

### [2020/12/20] v2.21.1-en

- Files and Directories php outputs permissions can be set in config.php

### [2020/12/20] theme, Readme_Shichan.html, readme_pch.html

- theme
  - [Picture in the middle of posting] to [temporary pictures]
- Readme_Shichan.html, readme_pch.html
  - Those files are Not allowed to change when bundling the Shi-Painter applet.
  - So I made Readme_Shichan_utf-8.html and readme_pch_utf-8.html.
  - Just changed the character code to UTF-8. (Information for developers are written in.)

### [2020/12/20] theme -> mono_paint.html

- managed to get rid of the untranslated part ( [L] and [R] )

### [2020/12/20]

- translating project started.
  - config.php, picpost.php, and security_c.html were done.
  - readme.txt, potiboard.php, and search.php is not yet.
  - theme has a problem. I couldn't translate a short word well.
