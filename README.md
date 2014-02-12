Introduction
------------------------------------

#### What?
It's a GUI framework for Unity that aims to keep things as simple as possible while keeping draw calls to an absolute minimum. I am developing this in tandem with my Deus Ex-based game project <a href="http://mrzapp.github.io/vongott/">The Vongott Chronicles</a>

#### Why?
GUI frameworks for Unity are overpriced, and the built-in API is a ridiculous resource hog with every widget requiring one or two draw calls. And we can't expect Unity to provide a decent UI system "sometime in the future", when we are ready to develop games now :) So this framework is using the OpenGL API to render widgets, and trying its best to be simple and easy to use at the same time.

#### Notes
- Yes, it does work with C# project  
- It is an open source project developed in the contributors' spare time  
- It won't cost you anything, but it comes without guarantee  

#### Contribution
Anyone willing to provide feedback, fixes, new implementations, whatever you might think of are very welcome to join as a contributor.


FAQ
------------------------------------
**Does OpenGUI work with C# even though it's written in UnityScript?**  
Yep, as long as the provided directory configuration is maintained and .cs files are in a subfolder, .e.g /Assets/Scripts. This is because of the Unity [compilation order] (http://docs.unity3d.com/412/Documentation/ScriptReference/index.Script_compilation_28Advanced29.html).

**I've created widgets, but nothing's displaying. What's wrong?**  
Make sure your OGPage object is the current one, and make sure your OGRoot object has a Camera component

**Where are the tutorials and documentation?**  
In the [wiki] (https://github.com/mrzapp/opengui/wiki)  

**What about examples?**  
Check out the [example project] (https://github.com/mrzapp/opengui/releases/tag/example)

**How can I align object realtive to the screen?**  
A: The "anchor" and "pivot" prperties of the OGWidget and subclasses take care of that.


Technical overview
------------------------------------
![diagram](https://raw2.github.com/mrzapp/opengui/master/Screenshots/diagram.jpg)

#### Rendering
OpenGUI utilises the low-level OpenGL library in Unity. Every base widget has its own drawing rectangle and texture coordinates depending on the assigned OGStyle. OGRoot starts the draw loop by setting a pixel matrix according to the screen size, passes the atlas material from the OGSkin and then uses the drawing rectangles and texture coordinates to "move and crop the atlas" for every widget. The depth of a widget is solely dependent on the Z buffer, so there should be no confusion about what is on top of what.
   
#### Positioning and scaling
Screen-relative stretching and anchoring is calculated on the Transform component first. Then the position and scale of the drawing rectangle is derived from the Transform component and recalculated to fit the "flipped"" coordinates of OpenGL. 

License
------------------------------------
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">OpenGUI</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">mrzapp</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/mrzapp/opengui" rel="dct:source">https://github.com/mrzapp/opengui</a>.
