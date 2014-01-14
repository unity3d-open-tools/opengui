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
	// Clean up from previous OpenGUI structure ( sorry! )
	////////////////////
	override function ClearChildren () {
		isSelectable = true;
		
		// Image
		if ( image != null ) {	
			DestroyImmediate ( image.gameObject );
		}

		// Background		
		if ( background != null ) {
			DestroyImmediate ( background.gameObject );
		}

		// Label
		if ( label != null ) {
			DestroyImmediate ( label.gameObject );
		}
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Null check
		if ( image != null || label != null || background != null ) {
			ClearChildren ();
		}	
	
		// Styles
		currentStyle = isDown ? styles.active : styles.basic;

		// Mouse
		mouseRct = drawRct;
	}

	
	////////////////////
	// Draw
	////////////////////
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle.coordinates, currentStyle.border, drawDepth );
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth );
	}
}
