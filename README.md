### What is it?
It's a versatile and super simple GUI framework for Unity.
It takes advantage of the native GUI classes, but allows you to work with it in edit mode and to some extent with 3D objects as well.
It's still in its early stages, but I consider it ready for a beta release.
I am developing this in tandem with my Deus Ex-based game project [url=http://mrzapp.github.io/vongott/]The Vongott Chronicles[/url]

### About the C# version
It's a few versions behind, but we're working on it

### Why?
The reason for making this is that I don't have the patience to sit around and wait for the upcoming UI engine (and I don't know whether I'll even want to use it or not), and I find the UI frameworks in the Asset Store bloated and/or expensive. This is a fat-free open source alternative, for those of you who might be interested in that.

### How to use it?
You can use the editor menu to add widgets or just create empty game objects and add components manually.
The draw order, scale and position of the widget classes are inherited from the game object's transform component.
You can refer to the [url=http://htmlpreview.github.io/?https://raw.github.com/mrzapp/opengui/master/Build/Build.html]example[/url] project for a demonstration and the somewhat sparse [URL="https://github.com/mrzapp/opengui/wiki"]API reference[/URL].
I would be happy to write a few tutorials, if this thing catches on.

### Features
- Drawing 2D & 3D GUI in edit mode (in game view)
- Supports most regular widget types, plus a few odd ones
- Super simple, no bloat
- Sensibly managed and easy to use
- Built-in page manager
- Implements [url=http://itween.pixelplacement.com/index.php]iTween[/url] by Bob Berkebile
- MouseOver detection
- Free & Open Source!

### Example
[url=http://htmlpreview.github.io/?https://raw.github.com/mrzapp/opengui/master/Build/Build.html]here[/url]

### Contribution
Any help, including feature requests and bug fixes, is much appreciated :)

### Notes
- This is not a finished product, there might be some errors and missing features, although it mostly works without a hitch.
- This is not an optimal package to be used on mobile platforms, as the OnGUI draw loops force every widget to be its own draw call.
