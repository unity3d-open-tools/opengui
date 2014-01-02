#pragma strict

class OGCameraWindow extends OGWidget {
	var targetCamera : Camera;

	override function UpdateWidget () {
		if ( targetCamera ) {
			targetCamera.rect = drawRct;
		}
	}
}
