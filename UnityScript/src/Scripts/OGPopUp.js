#pragma strict

@script AddComponentMenu ("OpenGUI/PopUp")

class OGPopUp extends OGWidget {	
	public var title : String = "";
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
		
		SetDrawn ( isDrawn );
	}
		
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
		
		Build ();
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
		
			ToggleUp ( false );
		}
		
		SetDrawn ( isDrawn );
	}
	
	override function OnMouseDown () {
		if ( !isUp && GetMouseOverOption() == -1 ) {		
			ToggleUp ( true );
			timeStamp = Time.time;
		}
		
		SetDrawn ( isDrawn );
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
		
		ToggleUp ( false );

		SetDrawn ( isDrawn );

		OGRoot.GetInstance().ReleaseWidget ();
	}


	////////////////////
	// Set drawn
	////////////////////
	override function SetDrawn ( drawn : boolean ) {
		isDrawn = drawn;
	
		for ( var i : int = 0; i < optionLabels.transform.childCount; i++ ) {
			var lbl : OGLabel = optionLabels.transform.GetChild(i).GetComponent(OGLabel);
			lbl.isDrawn = isDrawn && isUp;
		}

		background.isDrawn = isDrawn;
		label.isDrawn = isDrawn;
	
		SetDirty ();
	}


	////////////////////
	// Build
	////////////////////
	override function Build () {
		isSelectable = true;
		
		var i : int = 0;
		var lbl : OGLabel;

		// Option labels container
		if ( !optionLabels && !this.transform.Find("Options") ) {
			optionLabels = new GameObject ( "Options" );
			optionLabels.transform.parent = this.transform;
			optionLabels.transform.localPosition = new Vector3 ( 0, 1, 0 );
			optionLabels.transform.localScale = Vector3.one;
			optionLabels.transform.localEulerAngles = Vector3.zero;

		} else if ( !optionLabels ) {
			optionLabels = this.transform.Find("Options").gameObject;
		}

		// Option labels
		if ( options == null ) {
			options = new String[0];
		}
		
		// ^ Edit existing or create new ones
		for ( i = 0; i < options.Length; i++ ) {
			if ( i < optionLabels.transform.childCount ) {
				lbl = optionLabels.transform.GetChild(i).GetComponent(OGLabel);
			} else {
				lbl = new GameObject ( options[i], OGLabel ).GetComponent(OGLabel);
				lbl.transform.parent = optionLabels.transform;
			}
			
			lbl.text = options[i];
			lbl.transform.localScale = Vector3.one;
			lbl.transform.localEulerAngles = Vector3.zero;
			lbl.transform.localPosition = new Vector3 ( 0, i, 0 );
			lbl.hidden = true;
			lbl.styles.basic = this.styles.basic;
			lbl.anchor.x = RelativeX.None;
			lbl.anchor.y = RelativeY.None;
		}	
		
		// ^ Destroy remaining
		if ( optionLabels.transform.childCount > options.Length ) {
			for ( i = options.Length; i < optionLabels.transform.childCount; i++ ) {
				DestroyImmediate ( optionLabels.transform.GetChild(i).gameObject );
			}	
		}

		// Background	
		if ( background == null ) {
			if ( this.transform.Find("SlicedSprite") ) {
				background = this.transform.Find("SlicedSprite").GetComponent ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				background = newSprite;
			}
		}
					
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localPosition = new Vector3 ( 0, 0, 1 );
		
		background.pivot.x = pivot.x;
		background.pivot.y = RelativeY.Top;
		background.hidden = true;

		// Title label		
		if ( label == null ) {
			if ( this.transform.Find("Label") ) {
				label = this.transform.Find("Label").GetComponent(OGLabel);
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				label = newLabel;
			}
		}
		
		label.transform.localScale = Vector3.one;
		label.transform.localEulerAngles = Vector3.zero;
		label.transform.localPosition = Vector3.zero;
		
		label.pivot.x = pivot.x;
		label.pivot.y = RelativeY.Top;
		
		label.hidden = true;

		// Set styles
		ToggleUp ( isUp );

		// Set drawn
		SetDrawn ( isDrawn );
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Null check
		if ( !optionLabels || !label || !background || optionLabels.transform.childCount != options.Length ) {
			Build ();
		}

		// Mouse
		mouseRct = background.drawRct;

		// Update data
		if ( String.IsNullOrEmpty ( selectedOption ) ) {
			label.text = title;
		} else {
			label.text = selectedOption;
		}
			
	}
}
