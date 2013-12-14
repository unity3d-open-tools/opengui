#pragma strict

@script AddComponentMenu ("OpenGUI/Button3D")

class OGButton3D extends MonoBehaviour {
	enum ButtonExecType {
		Press,
		Release
	}
	
	var cam : Camera;
	var layerMask : LayerMask;
	var func : Function;
	var messageTarget : GameObject;
	var message : String = "";
	var hoverMessage : String = "";
	var outMessage : String = "";
	var argument : String = "";
	var pressBack : Vector3;
	var executeOn : ButtonExecType;
	
	
	// Hover
	function Hover () {
		if ( !messageTarget ) { return; }
		if ( hoverMessage == "" ) { return; }
		
		if ( argument != "" ) {
			messageTarget.SendMessage ( hoverMessage, argument );
		} else {
			messageTarget.SendMessage ( hoverMessage, this );
		}
	}
	
	// Out
	function Out () {
		if ( !messageTarget ) { return; }
		if ( outMessage == "" ) { return; }
		
		if ( argument != "" ) {
			messageTarget.SendMessage ( outMessage, argument );
		} else {
			messageTarget.SendMessage ( outMessage, this );
		}
		
	}
	
	// Send message
	function SendMessage () {
		if ( func ) {
			func ();
			return;
		}
		
		if ( !messageTarget ) { Debug.LogError ( "No message target set" ); return; }
		if ( message == "" ) { Debug.LogError ( "No message set" ); return; }
			
		if ( argument != "" ) {
			messageTarget.SendMessage ( message, argument );
		} else {
			messageTarget.SendMessage ( message, this );
		}
	}
	
	// Press button
	function PressButton () {
		if ( executeOn == ButtonExecType.Press ) {
			SendMessage ();
			return;
		}
		
		// animate
		transform.localPosition += pressBack;		
	}
	
	// Release button
	function ReleaseButton () {
		// animate
		transform.localPosition -= pressBack;		
		
		if ( executeOn == ButtonExecType.Release ) {
			SendMessage ();
		}
	}
	
	// Init
	function Start () {
		if ( !cam ) {
			cam = Camera.main;
		}
	}
	
	// Update
	function Update () {
		var ray : Ray = cam.ScreenPointToRay ( Input.mousePosition );
		var hit : RaycastHit;
				
		if ( Physics.Raycast ( ray, hit, Mathf.Infinity, layerMask ) ) {
			var col : Collider = hit.collider;
			
			if ( col == this.collider ) {
				if ( Input.GetMouseButtonDown(0) ) {
					PressButton ();
				
				} else if ( Input.GetMouseButtonUp(0) ) {
					ReleaseButton ();	
					
				} else {
					Hover ();
				
				}
			}
		} else {
			Out ();
			
		}
	}
}