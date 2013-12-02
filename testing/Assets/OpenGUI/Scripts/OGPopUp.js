#pragma strict

@script AddComponentMenu ("OpenGUI/PopUp")

class OGPopUp extends OGWidget {	
	public var title : String;
	public var options : String[];
	public var target : GameObject;
	public var message : String;
	public var passSelectedOption : boolean = false;
	
	@HideInInspector public var selectedOption : String;
	@HideInInspector public var upStyle : OGStyle;
	@HideInInspector public var hoverStyle : OGStyle;
	
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	private var optionLabels : GameObject;
	private var timeStamp : float;
	private var isUp = false;
	
	private function GetMouseOverOption () : int {
		for ( var i : int = 0; i < optionLabels.transform.childCount; i++ ) {
			if ( CheckMouseOver ( optionLabels.transform.GetChild(i).GetComponent(OGLabel).drawRct ) ) {
				return i;
			}
		}
		
		return -1;
	}
	
	override function OnMouseUp () {
		var mouseOverOption : int = GetMouseOverOption ();
		
		if ( Time.time - timeStamp > 0.5 || mouseOverOption != -1 ) {
			OnMouseCancel ();
		}
		
		if ( mouseOverOption != -1 ) {
			selectedOption = options[mouseOverOption];
		}
	}
	
	override function OnMouseDown () {
		if ( !isUp && GetMouseOverOption() == -1 ) {		
			isUp = true;
			timeStamp = Time.time;
		}
	}
	
	override function OnMouseOver () {
		if ( isUp ) {
			for ( l in optionLabels.transform.GetComponentsInChildren.<OGLabel>() ) {
				if ( CheckMouseOver ( l.drawRct ) ) {
					l.style = hoverStyle;
				} else {
					l.style = style;
				}
			}
		}
	}
	
	override function OnMouseCancel () {
		isUp = false;
		
		OGRoot.GetInstance().ReleaseWidget ();
	}
	
	override function UpdateWidget ( root : OGRoot ) {
		if ( !optionLabels && !this.transform.Find("Options") ) {
			optionLabels = new GameObject ( "Options" );
			optionLabels.transform.parent = this.transform;
			optionLabels.transform.localPosition = new Vector3 ( 0, 1, 0 );
			optionLabels.transform.localScale = Vector3.one;
			optionLabels.transform.localEulerAngles = Vector3.zero;
		
		} else if ( !optionLabels ) {
			optionLabels = this.transform.Find("Options").gameObject;
		
		} else if ( optionLabels.transform.childCount != options.Length ) {
			for ( var x : int = 0; x < optionLabels.transform.childCount; x++ ) {
				DestroyImmediate ( optionLabels.transform.GetChild(x).gameObject );
			}
			
			var tempList : List.< OGLabel > = new List.< OGLabel > ();
			
			for ( var i : int = 0; i < options.Length; i++ ) {
				var lbl : OGLabel = new GameObject ( options[i], OGLabel ).GetComponent ( OGLabel );
				lbl.transform.parent = optionLabels.transform;
				lbl.transform.localScale = Vector3.one;
				lbl.transform.localEulerAngles = Vector3.zero;
				lbl.transform.localPosition = new Vector3 ( 0, i, 0 );
			}
		
		} else {
			optionLabels.SetActive ( isUp );
			
			for ( var o : int = 0; o < options.Length; o++ ) {
				var l : OGLabel = optionLabels.transform.GetChild ( o ).GetComponent ( OGLabel );
				l.transform.localScale = Vector3.one;
				l.transform.localEulerAngles = Vector3.zero;
				l.transform.localPosition = new Vector3 ( 0, o, 0 );
				l.hidden = true;
				l.style = style;
				l.text = options[o];
			}
		
		}
		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				newSprite.style = this.style;
			}
		
		} else {
			
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = Vector3.zero;
			
			background.pivot.x = pivot.x;
			background.pivot.y = RelativeY.Top;
								
			if ( isUp ) {
				background.style = upStyle;
				background.transform.localScale = new Vector3 ( 1, optionLabels.transform.childCount+1.1, 1 );
			} else {
				background.style = style;
				background.transform.localScale = Vector3.one;
			}
			
			background.isDrawn = isDrawn;
			background.hidden = true;
		
			mouseOver = CheckMouseOver ( background.drawRct );
		}
		
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
			}
		
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
				label.style = upStyle;
			} else {
				label.style = style;
			}
			
			label.isDrawn = isDrawn;
			label.hidden = true;
		}
		
		if ( mouseOver ) {
			OnMouseOver ();
		}
	}
}
