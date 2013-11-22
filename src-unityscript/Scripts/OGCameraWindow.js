#pragma strict

@script AddComponentMenu ("OpenGUI/CameraWindow")

class OGCameraWindow extends OGWidget {
	var targetCamera : Camera;
	
	override function Draw ( x : float, y : float ) {
		if ( targetCamera ) {
			if (Event.current.type == EventType.Repaint) {
				var cWidth : float = transform.localScale.x / Screen.width;
				var cHeight : float = transform.localScale.y / Screen.height;
				var cPosX : float = x / Screen.width;
				var cPosY : float = 1 - ( y / Screen.height ) - cHeight;
				
				targetCamera.rect = new Rect ( cPosX, cPosY, cWidth, cHeight );
				
				targetCamera.Render();
			}
		}
	}
}