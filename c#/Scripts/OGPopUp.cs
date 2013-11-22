using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/PopUp")]
public class OGPopUp : OGWidget {

	public string title;
	public bool isUp = false;
	public string[] options;
	public string message;
	public GameObject messageTarget;
	public Vector2 padding = new Vector2 ( 8.0f, 8.0f );
	
	public string selectedOption;
	float originalZ = 99;
				
	// Draw
	public override void Draw (  float x ,   float y   ){	
		if ( guiStyle == null ) { guiStyle = GUI.skin.box; }
		
		GUIStyle textStyle = new GUIStyle();
		textStyle.font = GUI.skin.label.font;
		textStyle.normal.textColor = guiStyle.normal.textColor;
		textStyle.fontSize = guiStyle.fontSize;
		textStyle.alignment = guiStyle.alignment;
								
		if ( !isUp ) {			
			string label;
			
			if ( selectedOption != "" ) {
				label = selectedOption;
			} else {
				label = title;
			}
			
			GUI.Box ( new Rect( x, y, transform.localScale.x + (guiStyle.padding.left * 2), transform.localScale.y ), "", guiStyle );
			
			if ( GUI.Button ( new Rect( x, y, transform.localScale.x + (guiStyle.padding.left * 2), transform.localScale.y ), label, textStyle ) ) {
				isUp = true;
			}
		} else {			
			GUI.Box ( new Rect( x, y, transform.localScale.x + (guiStyle.padding.left * 2), ( options.Length * (guiStyle.fontSize + padding.y) ) + ( guiStyle.padding.top * 2 ) ), "", guiStyle );
			
			for ( int i = 0; i < options.Length; i++ ) {			
				if ( GUI.Button ( new Rect( x + guiStyle.padding.left, y + padding.y * 0.5f + ( ( guiStyle.fontSize + padding.y ) * i ), transform.localScale.x + ( guiStyle.padding.left * 2 ), guiStyle.fontSize + guiStyle.padding.top ), options[i], textStyle ) ) {
					selectedOption = options[i];
					isUp = false;
					
					if ( messageTarget && message != "" ) {
						messageTarget.SendMessage ( message, i );
					}
				}
			}
		}
	}

	public void SetSelection ( int id  ){
		selectedOption = options[id];
		//label = selectedOption;
	}
	
	// Update
	public override void UpdateWidget (){		
		if ( originalZ == 99 ) {
			originalZ = transform.localPosition.z;
		}
		
		if ( isUp ) {
			transform.localPosition += new Vector3(0f, 0f, -10f);
		} else {
			transform.localPosition = new Vector3(transform.localPosition.x, transform.localPosition.y, originalZ);
		}
		
		if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			isUp = false;
		}
	}
}
