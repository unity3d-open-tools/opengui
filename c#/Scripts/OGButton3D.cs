using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Button3D")]
public class OGButton3D : OGWidget {

	enum ButtonExecType {
		Press,
		Release
	}
	
	public GameObject messageTarget;
	public string message;
	public string argument;
	float pressBack;
	ButtonExecType executeOn;
	
	// Send message
	void SendMessage (){
		
		if ( !messageTarget ) { Debug.LogError ( "No message target set" ); return; }
		if ( string.IsNullOrEmpty(message) ) { Debug.LogError ( "No message set" ); return; }
			
		if ( string.IsNullOrEmpty(argument) ) {
			messageTarget.SendMessage ( message, argument );
		} else {
			messageTarget.SendMessage ( message );
		}
	}
	
	// Press button
	void PressButton (){
		if ( executeOn == ButtonExecType.Press ) {
			SendMessage ();
			return;
		}
		
		// animate
		transform.localPosition = new Vector3 ( transform.localPosition.x, transform.localPosition.y, transform.localPosition.z + pressBack );		
	}
	
	// Release button
	void ReleaseButton (){
		// animate
		transform.localPosition = new Vector3 ( transform.localPosition.x, transform.localPosition.y, transform.localPosition.z - pressBack );		
		
		if ( executeOn == ButtonExecType.Release ) {
			SendMessage ();
		}
	}
	
	// Init
	void Start (){
	}
	
	// Update
	void Update (){
		var ray= Camera.main.ScreenPointToRay ( Input.mousePosition );
		RaycastHit hit;
		
		if ( Physics.Raycast ( ray, out hit ) ) {
			GameObject obj = hit.collider.gameObject;
			
			if ( obj == gameObject ) {
				if ( Input.GetMouseButtonDown(0) ) {
					PressButton ();
				} else if ( Input.GetMouseButtonUp(0) ) {
					ReleaseButton ();						
				}
			}
		
		}
	}
}
