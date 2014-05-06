## OpenGUI
It’s a GUI framework for Unity that aims to keep things as simple as possible while keeping draw calls to an absolute minimum.

## Demo
[![demo](https://raw.githubusercontent.com/mrzapp/opengui/master/Screenshots/webdemo.jpg)](http://htmlpreview.github.io/?http://github.com/mrzapp/opengui/blob/master/Build/Build.html)

## FAQ
#### Is this open source? Where is the GitHub page?
Yes it is, and [here](http://github.com/mrzapp/opengui) it is.

#### Does OpenGUI work with C# even though it is written in UnityScript?
Yep, as long as the provided directory configuration is maintained and .cs files are in a subfolder, .e.g /Assets/Scripts. This is because of the Unity [compilation order](http://docs.unity3d.com/412/Documentation/ScriptReference/index.Script_compilation_28Advanced29.html).

#### I have created widgets, but nothing is displaying. What might be wrong?
Make sure your [`OGPage`](https://github.com/mrzapp/opengui/wiki/OGPage) object is the current one, and make sure your [`OGRoot`](https://github.com/mrzapp/opengui/wiki/OGRoot) object has a [`Camera`](http://docs.unity3d.com/Documentation/ScriptReference/Camera.html) component

#### Where are the tutorials and documentation?
In the [wiki](https://github.com/mrzapp/opengui/wiki)  

#### What about examples?
They are included in the release under /Plugins/OpenGUI/Examples

#### How can I align objects relatively to the screen?
The "anchor" and "pivot" properties of the [`OGWidget`](https://github.com/mrzapp/opengui/wiki/OGWidget) and subclasses take care of that.  

#### How do I deal with different aspect ratios?
Make sure to use "anchor" and "stretch" to position your content, if you want it to be flexible.


## License
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">OpenGUI</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">mrzapp</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/mrzapp/opengui" rel="dct:source">https://github.com/mrzapp/opengui</a>.
