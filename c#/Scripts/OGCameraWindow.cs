using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/CameraWindow")]
public class OGCameraWindow : OGWidget {

	public Camera targetCamera;
	
	public override void Draw (  float x ,   float y   ){
		if ( targetCamera ) {
			if (Event.current.type == EventType.Repaint) {
				float cWidth = transform.localScale.x / Screen.width;
				float cHeight = transform.localScale.y / Screen.height;
				float cPosX = transform.position.x / Screen.width;
				float cPosY = 1 - ( transform.position.y / Screen.height ) - cHeight;
				
				targetCamera.rect = new Rect ( cPosX, cPosY, cWidth, cHeight );
				
				targetCamera.Render();
			}
		}
	}
}
