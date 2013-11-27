#pragma strict

class OGButton extends OGWidget {
	public var text : String;
	public var target : GameObject;
	public var message : String;
	public var func : Function;
	
	@HideInInspector public var downStyle : OGStyle;
	@HideInInspector public var hoverStyle : OGStyle;
	
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	
	override function OnMouseUp () {
		label.style = style;
		background.style = style;
		
		if ( func ) {
			func ();
				
		} else if ( target != null && !String.IsNullOrEmpty ( message ) ) {
			target.SendMessage ( message );
		
		} else {
			Debug.LogWarning ( "OGButton '" + this.gameObject.name + "' | Target/message missing!" );
		
		}
	}
	
	override function OnMouseOver () {
	
	}
	
	override function OnMouseCancel () {
		label.style = style;
		background.style = style;
		
		OGRoot.GetInstance().ReleaseWidget ();
	}
	
	override function OnMouseDown () {
		label.style = downStyle;
		background.style = downStyle;
	}
	
	override function UpdateWidget ( root : OGRoot ) {
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				newSprite.style = this.style;
			}
		
		} else {
			background.transform.localScale = Vector3.one;
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = Vector3.zero;
		
			background.isDrawn = isDrawn;
			background.hidden = true;
			mouseOver = CheckMouseOver ( background.drawRct );
		}
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				newLabel.text = text;
				newLabel.style = this.style;
			}
		
		} else {
			label.text = text;
			label.transform.localScale = Vector3.one;
			label.transform.localEulerAngles = Vector3.zero;
			label.transform.localPosition = Vector3.zero;
			
			label.isDrawn = isDrawn;
			label.hidden = true;
		}
				
		if ( mouseOver ) {
			OnMouseOver ();
		}
	}
}