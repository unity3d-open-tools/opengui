#pragma strict

@script ExecuteInEditMode()
class OGArrangeInCircle extends MonoBehaviour {
	var onlyRotate : boolean = false;	
	var rotate : Vector3;
	var radius : float;
	var offset : float;
	var objects : Transform[];
		
	var rearrangeNow : boolean;
	
	function Update () {
		if ( rearrangeNow ) {
			rearrangeNow = false;
			
			for ( var i = 0; i < objects.Length; i++ ) {
				var newVector : Vector3 = Vector3.zero;
				
				newVector.x = radius * Mathf.Cos ( ( i + offset ) * Mathf.PI / ( objects.Length / 2 ) );
				newVector.y = radius * Mathf.Sin ( ( i + offset ) * Mathf.PI / ( objects.Length / 2 ) );
			
				var rotX : float = rotate.x * ( i * ( 360 / objects.Length ) );
				var rotY : float = rotate.y * ( i * ( 360 / objects.Length ) );
				var rotZ : float = rotate.z * ( i * ( 360 / objects.Length ) );
							
				objects[i].localEulerAngles = new Vector3 ( rotX, rotY, rotZ );
			
				if ( !onlyRotate ) {
					objects[i].localPosition = newVector;
				}
			}
		}
	}
}