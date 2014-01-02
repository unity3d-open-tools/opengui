#pragma strict

class OGButton extends OGWidget {
	public var hiddenString : String;
	public var text : String = "";
	public var target : GameObject;
	public var message : String;
	public var argument : String;
	public var func : Function;
	public var enableImage : boolean = false;
	public var imageScale : float = 1;
	public var imageOffset : Vector2 = Vector2.zero;

	private var background : OGSlicedSprite;
	private var label : OGLabel;
	private var image : OGSprite;
	private var isDown : boolean = false;

	
	////////////////////
	// Interact
	////////////////////
	override function OnMouseUp () {
		if ( func ) {
			func ();
				
		} else if ( target != null && !String.IsNullOrEmpty ( message ) ) {
			if ( !String.IsNullOrEmpty ( argument ) ) {
				target.SendMessage ( message, argument );
			} else {	
				target.SendMessage ( message, this );
			}

		} else {
			Debug.LogWarning ( "OGButton '" + this.gameObject.name + "' | Target/message missing!" );
		
		}

		OnMouseCancel ();
	}
	
	override function OnMouseCancel () {
		isDown = false;
		OGRoot.GetInstance().ReleaseWidget ();
		SetDirty();
	}
	
	override function OnMouseDown () {
		isDown = true;
		SetDirty();
	}
	
	
	////////////////////
	// Set drawn
	////////////////////
	override function SetDrawn ( drawn : boolean ) {
		if ( !image || !label || !background ) {
			Build ();
		}	
		
		isDrawn = drawn;
	
		image.isDrawn = isDrawn && enableImage;
		background.isDrawn = isDrawn;
		label.isDrawn = isDrawn;
	}


	////////////////////
	// Build
	////////////////////
	override function Build () {
		isSelectable = true;
		
		// Image
		if ( image == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSprite ) ) {
				image = this.gameObject.GetComponentInChildren ( OGSprite );
			
			} else {
				var newImage : OGSprite = new GameObject ( "Sprite", OGSprite ).GetComponent ( OGSprite );
				newImage.transform.parent = this.transform;
				image = newImage;
			}
		}
		
		if ( enableImage ) {
			image.transform.localScale = new Vector3 ( image.styles.basic.coordinates.width / this.transform.localScale.x, image.styles.basic.coordinates.height / this.transform.localScale.y, 1 ) * imageScale;
			image.transform.localPosition = new Vector3 ( 0.5 + imageOffset.x, 0.5 + imageOffset.y, 0 );
			image.transform.localEulerAngles = Vector3.zero;

			image.styles.basic = this.styles.thumb;
			image.pivot.x = RelativeX.Center;
			image.pivot.y = RelativeY.Center;
			image.hidden = true;
		}

		image.isDrawn = isDrawn && enableImage;
		
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				background = newSprite;
			}
		}
		
		background.transform.localScale = Vector3.one;
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localPosition = Vector3.zero;
	
		background.isDrawn = isDrawn;
		background.hidden = true;
		background.pivot = this.pivot;
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				label = newLabel;
			}
		}

		label.transform.localScale = Vector3.one;
		label.transform.localEulerAngles = Vector3.zero;
		label.transform.localPosition = Vector3.zero;
		
		label.isDrawn = isDrawn;
		label.hidden = true;
		label.pivot = this.pivot;
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Null check
		if ( !image || !label || !background ) {
			Build ();
		}	
		
		// Mouse
		mouseRct = background.drawRct;
		
		// Update data
		label.text = text;

		// Styles
		if ( isDown ) {
			label.styles.basic = this.styles.active;
			background.styles.basic = this.styles.active;
		} else {	
			label.styles.basic = this.styles.basic;
			background.styles.basic = this.styles.basic;
		}
	}
}
