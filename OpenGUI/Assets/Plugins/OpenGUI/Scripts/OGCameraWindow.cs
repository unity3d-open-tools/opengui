using UnityEngine;
using System.Collections;

public class OGCameraWindow : OGWidget {
	public Camera targetCamera;

	private Camera rootCamera;

	override public void UpdateWidget () {
		if ( targetCamera ) {
			if ( !rootCamera ) {
				rootCamera = root.GetComponent<Camera>();
			}

			targetCamera.rect = new Rect ( drawRct.x / Screen.width, drawRct.y / Screen.height, drawRct.width / Screen.width, drawRct.height / Screen.height );
		
			// The target camera needs to render after the root camera
			if ( targetCamera.depth <= rootCamera.depth ) {
				targetCamera.depth = rootCamera.depth + 1;
			}
		}
	}
}
