# Mode Icons Font

We have a couple of icon fonts we use in the app, Material Icons and Fontawesome icons. However, they don't always have the icon we need so sometime
we need to use custom icon. We can use individual SVG as icon but it would be hard to style them e.g. change the size and color. So we will also
convert our custom SVG icons into a font icons and we will call it Mode-icons-font. Mode icons font will be a font that contains all the custom icons
for Mode and we can use like the way we use Fontawesome.

## Creating/Updating the Mode-Icons-Font.
- We will be using iconmoon.io app for creating Mode-Icons-Font https://icomoon.io/app/#/select
- If this is the first time you create the Mode-Icons-Font on iconmoon.io, you will need to create an empty set of icons and name it "mode-icons-font"
- Add new icon or updated icon from the /src-svg directory to the icon set. /src-svg is where we will store all the icon SVG files.
- Before you can generate the font, you need to "Select" the icons from the set. So click on the icons you want to add to the font to select them.
- At the bottom of the page, there will be a tab call "Generate Font", click on it to generate font. This will generate the font and save it in
iconmoon.io server.
- If this is your first time then you need to configure the generated font. On top of the app, there is option call "Preferences", click on it to
see the options. You need to change the option to these
    - Change font name to "mode-icons-font"
    - Class Prefix and Class Suffix should be blank
    - Un-check all options
    - For "CSS Selector" check the last option, "Use a class" and enter `.mode-icon` in the text input field below that.
    - Close the Preference dialog and it should generate a new font right away.
- We don't want to be loading Mode icon font from iconmoon.io server so we need to download the font and load it locally from our SCSS file.
Find and click the "Download" button at the bottom of the page where you found the "Generate Font" button. It will be a zip file containing the font
file, CSS file, and other files required for the font to work properly. Unzip the file and then copy everything extracted from the Zip file into
the /mode-icons-font folder.
- Now rebuild the app and the new/updated icons will be available to use in the app.

