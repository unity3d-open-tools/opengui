using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
[AddComponentMenu ("OpenGUI/Ruler")]
public class OGRuler : OGWidget {

	public Color color = Color.white;

	Texture2D bg;

	void Start (){
		bg = new Texture2D(2,2);
	}

	public override void Draw (  float x ,   float y   ){
		GUI.DrawTexture ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), bg );
	}
	
	public override void UpdateWidget (){
		bg.SetPixels(new Color[] { color,color,color,color });
		bg.Apply();
	}
}
