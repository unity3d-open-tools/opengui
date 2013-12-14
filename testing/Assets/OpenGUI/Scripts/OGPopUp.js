#pragma strict

@script AddComponentMenu ("OpenGUI/PopUp")

class OGPopUp extends OGWidget {	
	public var title : String;
	public var options : String[];
	public var target : GameObject;
	public var message : String;
	public var passSelectedOption : boolean = false;
	public var isUp = false;
	
	@HideInInspector public var selectedOption : String;
	
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	private var optionLabels : GameObject;
	private var timeStamp : float;
	
	
	////////////////////
	// Options
	////////////////////
	private function GetMouseOverOption () : int {
		for ( var i : int = 0; i < optionLabels.transform.childCount; i++ ) {
			if ( CheckMouseOver ( optionLabels.transform.GetChild(i).GetComponent(OGLabel).drawRct ) ) {
				return i;
			}
		}
		
		return -1;
	}
	
	public function SetOptions ( list : String[] ) {
		options = list;
		SetDirty();
	}

	
	////////////////////
	// Interaction
	////////////////////
	override function OnMouseUp () {
		var mouseOverOption : int = GetMouseOverOption ();
		
		if ( Time.time - timeStamp > 0.5 || mouseOverOption != -1 ) {
			OnMouseCancel ();
		}
		
		if ( mouseOverOption != -1 ) {
			selectedOption = options[mouseOverOption];

			if ( target != null && !String.IsNullOrEmpty ( message ) ) {
				if ( passSelectedOption ) {
					target.SendMessage ( message, selectedOption );
				} else {
					target.SendMessage ( message );
				}
			}	
		}
		
		SetDirty();
	}
	
	override function OnMouseDown () {
		if ( !isUp && GetMouseOverOption() == -1 ) {		
			ToggleUp ( true );
			timeStamp = Time.time;
		}
		
		SetDirty();
	}
	
	override function OnMouseOver () {
		if ( isUp ) {
			for ( l in optionLabels.transform.GetComponentsInChildren.<OGLabel>() ) {
				if ( CheckMouseOver ( l.drawRct ) ) {
					l.styles.basic = styles.hover;
				} else {
					l.styles.basic = styles.basic;
				}
			}
		}
	}
	
	override function OnMouseCancel () {
		isUp = false;
		
		OGRoot.GetInstance().ReleaseWidget ();
	}

	private function ToggleUp ( state : boolean ) {
		isUp = state;

		if ( state ) {
			label.styles.basic = styles.active;
			background.styles.basic = styles.active;
			background.transform.localScale = new Vector3 ( 1, optionLabels.transform.childCount+1.1, 1 );
		} else {
			label.styles.basic = styles.basic;
			background.styles.basic = styles.basic;
			background.transform.localScale = Vector3.one;
		}
		
		optionLabels.SetActive ( state );
	
		SetDirty();
	}
		
	
	////////////////////
	// Update
	////////////////////
	function OnEnable () {
		selectable = true;
	}
	
	override function UpdateWidget () {
		// Option labels
		if ( !optionLabels && !this.transform.Find("Options") ) {
			optionLabels = new GameObject ( "Options" );
			optionLabels.transform.parent = this.transform;
			optionLabels.transform.localPosition = new Vector3 ( 0, 1, 0 );
			optionLabels.transform.localScale = Vector3.one;
			optionLabels.transform.localEulerAngles = Vector3.zero;

			SetDirty ();
			return;

		} else if ( !optionLabels ) {
			optionLabels = this.transform.Find("Options").gameObject;

			SetDirty ();
			return;

		} else if ( options != null && optionLabels.transform.childCount == 0 ) {
			for ( var i : int = 0; i < options.Length; i++ ) {
				new GameObject ( options[i], OGLabel ).transform.parent = optionLabels.transform;
			}

			SetDirty ();
			return;

		} else if ( optionLabels.transform.childCount != options.Length ) {
			for ( var x : int = 0; x < optionLabels.transform.childCount; x++ ) {
				DestroyImmediate ( optionLabels.transform.GetChild(x).gameObject );
			}

			SetDirty ();
			return;

		} else {
			if ( optionLabels.activeSelf != isUp ) {
				optionLabels.SetActive ( isUp );
			}

			for ( var o : int = 0; o < options.Length; o++ ) {
				var l : OGLabel = optionLabels.transform.GetChild ( o ).GetComponent ( OGLabel );
				l.transform.localScale = Vector3.one;
				l.transform.localEulerAngles = Vector3.zero;
				l.transform.localPosition = new Vector3 ( 0, o, 0 );
				l.hidden = true;
				l.styles.basic = styles.basic;
				l.text = options[o];
				l.gameObject.name = options[o];
			}
		
		}
	
		// Background	
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				newSprite.styles.basic = this.styles.basic;
			}

			SetDirty ();
			return;
		
		} else {
			
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = new Vector3 ( 0, 0, 1 );
			
			background.pivot.x = pivot.x;
			background.pivot.y = RelativeY.Top;
								
			if ( isUp ) {
				background.styles.basic = styles.active;
				background.transform.localScale = new Vector3 ( 1, optionLabels.transform.childCount+1.1, 1 );
			} else {
				background.styles.basic = styles.basic;
				background.transform.localScale = Vector3.one;
			}
			
			background.isDrawn = isDrawn;
			background.hidden = true;
		
			mouseRct = background.drawRct;
		}

		// Title label		
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
			}

			SetDirty ();
			return;
		
		} else {
			if ( String.IsNullOrEmpty ( selectedOption ) ) {
				label.text = title;
			} else {
				label.text = selectedOption;
			}
			
			label.transform.localScale = Vector3.one;
			label.transform.localEulerAngles = Vector3.zero;
			label.transform.localPosition = Vector3.zero;
			
			label.pivot.x = pivot.x;
			label.pivot.y = RelativeY.Top;
			
			if ( isUp ) {
				label.styles.basic = styles.active;
			} else {
				label.styles.basic = styles.basic;
			}
			
			label.isDrawn = isDrawn;
			label.hidden = true;
		}
	}
}
