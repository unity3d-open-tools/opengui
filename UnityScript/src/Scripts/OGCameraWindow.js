#pragma strict

class OGCameraWindow extends OGWidget {
	var targetCamera : Camera;

	override function UpdateWidget () {
		if ( targetCamera ) {
			targetCamera.rect = new Rect ( drawRct.x / Screen.width, drawRct.y / Screen.height, drawRct.width / Screen.width, drawRct.height / Screen.height );
		}
	}
}
