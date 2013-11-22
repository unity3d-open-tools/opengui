using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Button")]
public class OGButton : OGWidget {

	public string text;
	public GameObject target;
	public string message;
	public string argument;

	public override void Draw (  float x ,   float y   ){		
		if ( guiStyle == null ) { guiStyle = GUI.skin.button; }
		
		if (GUI.Button(new Rect(x, y, transform.localScale.x, transform.localScale.y), text, guiStyle))
		{
			if (argument != "" && target != null)
			{
				target.SendMessage(message, argument);
			}
			else if (target)
			{
				target.SendMessage(message, this);
			}
		}
	}
}
