#pragma strict

class OGTween extends MonoBehaviour {
/*	enum TweenMessageSend {
		Begin,
		Complete
	}
	
	private class TweenType {
		var enabled : boolean = false;
		var destination : Vector3;
		var time : float = 1.0;
		var easing : iTween.EaseType;
	}
	
	var move : TweenType;
	var rotate : TweenType;
	var scale : TweenType;
	
	var ignoreTimeScale : boolean = true;
	var autoPlay : boolean = false;
	
	var messageTarget : GameObject;
	var message : String;
	var argument : String;
	var func : Function;
	var sendMessageOn : TweenMessageSend = TweenMessageSend.Complete;
		
	@HideInInspector var timer : float = 0.0;
	@HideInInspector var timerStarted : boolean = false;
	
	@HideInInspector var startPos : Vector3;
	@HideInInspector var startRot : Vector3;
	@HideInInspector var startScl : Vector3;
	
	function OGCallBack () {
		if ( func ) {
			func ();
			return;
		}
		
		if ( !messageTarget ) { return; }
		if ( !message ) { return; }
		
		if ( argument ) {
			messageTarget.SendMessage ( message, argument );
		} else {
			messageTarget.SendMessage ( message );
		}
	}
	
	function FindGreatest () : float {
		var a : float = 0.0;
		var b : float = 0.0;
		var c : float = 0.0;
		
		if ( move.enabled ) { a = move.time; }
		if ( rotate.enabled ) { b = rotate.time; }
		if ( scale.enabled ) { c = scale.time; }
		
		return Mathf.Max ( a, b, c );
	}
	
	function Play ( forward : boolean ) {
		if ( move.enabled ) {
			var moveDest : Vector3;
			
			if ( forward ) { moveDest = move.destination; }
			else { moveDest = startPos; }
			
			iTween.MoveTo ( gameObject, iTween.Hash (
				"position", moveDest,
				"time", move.time,
				"easetype", move.easing,
				"islocal", true,
				"ignoretimescale", ignoreTimeScale,
				"onupdatetarget", this.gameObject,
				"onupdate", "SetDirty"
			) );
		}
		
		if ( rotate.enabled ) {
			var rotDest : Vector3;
			
			if ( forward ) { rotDest = rotate.destination; }
			else { rotDest = startRot; }
			
			iTween.RotateTo ( gameObject, iTween.Hash (
				"rotation", rotDest,
				"time", rotate.time,
				"easetype", rotate.easing,
				"islocal", true,
				"ignoretimescale", ignoreTimeScale,
				"onupdatetarget", this.gameObject,
				"onupdate", "SetDirty"
			) );
		}
		
		if ( scale.enabled ) {
			var sclDest : Vector3;
			
			if ( forward ) { sclDest = scale.destination; }
			else { sclDest = startScl; }
			
			iTween.ScaleTo ( gameObject, iTween.Hash (
				"scale", sclDest,
				"time", scale.time,
				"easetype", scale.easing,
				"islocal", true,
				"ignoretimescale", ignoreTimeScale,
				"onupdatetarget", this.gameObject,
				"onupdate", "SetDirty"
			) );
		}
		
		if ( sendMessageOn == TweenMessageSend.Begin ) {
			OGCallBack ();
		} else {
			timerStarted = true;
			timer = FindGreatest();
		}
	}
	
	function Update () {
		if ( timerStarted && timer > 0.0 ) {
			timer -= Time.deltaTime;
		} else if ( timerStarted ) {
			OGCallBack();
		}
	}
	
	function Start () {
		Time.timeScale = 1.0;
		
		startPos = transform.localPosition;
		startRot = transform.localEulerAngles;
		startScl = transform.localScale;
	
		if ( autoPlay ) {
			Play ( true );
		}
	}
*/}
