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
	
	private var isDown : boolean = false;

	
	////////////////////
	// Rects
	////////////////////
	private function GetImageRect () : Rect {
		return new Rect ( drawRct.x + ( drawRct.width / 2 ) - ( ( drawRct.width * imageScale ) / 2 ) + imageOffset.x, drawRct.y + ( drawRct.height / 2 ) - ( ( drawRct.height * imageScale ) / 2 ) - imageOffset.y, drawRct.width * imageScale, drawRct.height * imageScale );
	}


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
	}
	
	override function OnMouseDown () {
		isDown = true;
	}
	

	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;

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

		if ( enableImage ) {
			OGDrawHelper.DrawSprite ( GetImageRect(), styles.thumb.coordinates, drawDepth );
		}
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth );
	}
}
