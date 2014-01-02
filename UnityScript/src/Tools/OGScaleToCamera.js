#pragma strict

class OGScaleToCamera extends MonoBehaviour {

	var cam : Camera;
	var distance : float = 0.5;
	
	function Update () {
		if ( !cam ) {
			cam = Camera.main;
		}
				
		var height : float = 2.0 * Mathf.Tan ( 0.5 * cam.fieldOfView ) * distance;
		var width : float = height * Screen.width / Screen.height;
		
	    var v3ViewPort : Vector3 = new Vector3 ( 0, 0, distance );
		
		var bottomLeft : Vector3 = cam.ViewportToWorldPoint ( v3ViewPort );
		v3ViewPort.Set( 1, 1, distance );
		var topRight : Vector3 = cam.ViewportToWorldPoint ( v3ViewPort );
		
		var targetWidth : float = Mathf.Abs( topRight.x - bottomLeft.x );
		var targetHeight : float = Mathf.Abs( topRight.y - bottomLeft.y );
		
		transform.localScale = new Vector3 ( bottomLeft.x-topRight.x,bottomLeft.y-topRight.y,distance*2);
	}
}