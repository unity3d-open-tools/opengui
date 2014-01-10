### What is it?
It's a GUI framework for Unity that aims to keep things as simple as possible while keeping draw calls to an absolute minimum. I am developing this in tandem with my Deus Ex-based game project <a href="http://mrzapp.github.io/vongott/">The Vongott Chronicles</a>

### Version 1.0
The next big version will deprecate OnGUI drawcalls and move towards the low-level GL API. While this does produce less draw calls, it requires a much move involved level of development, so it'll be a while before we get there. You can check out the example project in the UnityScript folder.

### C# version
The current C# is of the older, more stable build. It's currently more memory efficient per-widget, but the infrastructure is fairly clunky, and draw calls easily rocket into the several hundreds.

### Why?
The reason for making this is that I don't have the patience to sit around and wait for the upcoming UI engine (and I don't know whether I'll even want to use it or not), and I find the UI frameworks in the Asset Store bloated and/or expensive. This is a fat-free open source alternative, for those of you who might be interested in that.

### How to use it?
You can use the editor menu to add widgets or just create empty game objects and add components manually.
The draw order, scale and position of the widget classes are inherited from the game object's transform component.

### Features
- Drawing 2D & 3D GUI in edit mode (in game view)
- Supports most regular widget types, plus a few odd ones
- Super simple, no bloat
- Sensibly managed and easy to use
- Built-in page manager
- Implements <a hreaf="http://itween.pixelplacement.com/index.php">iTween</a> by Bob Berkebile
- MouseOver detection
- Free & Open Source!

### Contribution
Any help, including feature requests and bug fixes, is much appreciated :)

### License
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">OpenGUI</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">mrzapp</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/mrzapp/opengui" rel="dct:source">https://github.com/mrzapp/opengui</a>.
