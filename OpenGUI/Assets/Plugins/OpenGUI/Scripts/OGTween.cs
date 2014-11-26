using UnityEngine;
using System.Collections;

public class OGTween : MonoBehaviour {
/*	enum TweenMessageSend {
		Begin,
		Complete
	}
	
	private class TweenType {
		bool enabled = false;
		Vector3 destination;
		float time = 1.0;
		iTween easing.EaseType;
	}
	
	TweenType move;
	TweenType rotate;
	TweenType scale;
	
	bool ignoreTimeScale = true;
	bool autoPlay = false;
	
	GameObject messageTarget;
	String message;
	String argument;
	Function func;
	TweenMessageSend sendMessageOn = TweenMessageSend.Complete;
		
	[HideInInspector] float timer = 0.0;
	[HideInInspector] bool timerStarted = false;
	
	[HideInInspector] Vector3 startPos;
	[HideInInspector] Vector3 startRot;
	[HideInInspector] Vector3 startScl;
	
	void OGCallBack () {
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
	
	float FindGreatest () {
		float a = 0.0;
		float b = 0.0;
		float c = 0.0;
		
		if ( move.enabled ) { a = move.time; }
		if ( rotate.enabled ) { b = rotate.time; }
		if ( scale.enabled ) { c = scale.time; }
		
		return Mathf.Max ( a, b, c );
	}
	
	void Play ( bool forward ) {
		if ( move.enabled ) {
			Vector3 moveDest;
			
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
			Vector3 rotDest;
			
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
			Vector3 sclDest;
			
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
	
	void Update () {
		if ( timerStarted && timer > 0.0 ) {
			timer -= Time.deltaTime;
		} else if ( timerStarted ) {
			OGCallBack();
		}
	}
	
	void Start () {
		Time.timeScale = 1.0;
		
		startPos = transform.localPosition;
		startRot = transform.localEulerAngles;
		startScl = transform.localScale;
	
		if ( autoPlay ) {
			Play ( true );
		}
	}
*/}
