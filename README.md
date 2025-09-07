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
