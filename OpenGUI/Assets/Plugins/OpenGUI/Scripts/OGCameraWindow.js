#pragma strict

class OGCameraWindow extends OGWidget {
	public var targetCamera : Camera;

	private var rootCamera : Camera;

	override function UpdateWidget () {
		if ( targetCamera ) {
			if ( !rootCamera ) {
				rootCamera = root.GetComponent(Camera);
			}

			targetCamera.rect = new Rect ( drawRct.x / Screen.width, drawRct.y / Screen.height, drawRct.width / Screen.width, drawRct.height / Screen.height );
		
			// The target camera needs to render after the root camera
			if ( targetCamera.depth <= rootCamera.depth ) {
				targetCamera.depth = rootCamera.depth + 1;
			}
		}
	}
}
