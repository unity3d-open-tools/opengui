#pragma strict

class OGButton extends OGWidget {
	public var hiddenString : String;
	public var text : String = "";
	public var target : GameObject;
	public var message : String;
	public var argument : String;
	public var func : Function;
	public var action : System.Action;
	public var actionWithArgument : System.Action.< String >;
	public var argumentSource : MonoBehaviour;
	public var argumentSourceField : String = "";
	public var enableImage : boolean = false;
	public var imageScale : Vector2 = Vector2.one;
	public var imageOffset : Vector2 = Vector2.zero;
	
	private var isDown : boolean = false;

	
	////////////////////
	// Rects
	////////////////////
	private function GetImageRect () : Rect {
		return new Rect ( drawRct.x + ( drawRct.width / 2 ) - ( ( drawRct.width * imageScale.x ) / 2 ) + imageOffset.x, drawRct.y + ( drawRct.height / 2 ) - ( ( drawRct.height * imageScale.y ) / 2 ) - imageOffset.y, drawRct.width * imageScale.x, drawRct.height * imageScale.y );
	}


	////////////////////
	// Interact
	////////////////////
	override function OnMouseUp () {
		if ( func ) {
			if ( !String.IsNullOrEmpty ( argument ) ) {
				func ( argument );
			
			} else {
				func ();

			}
		
		} else if ( action ) {
			action ();
	
		} else if ( actionWithArgument && !String.IsNullOrEmpty ( argument ) ) {
			actionWithArgument ( argument );
		
		} else if ( target != null && !String.IsNullOrEmpty ( message ) ) {
			// if the source widget and source field are set then we
			// get the argument from this
			if ( argumentSource != null && !String.IsNullOrEmpty( argumentSourceField ) ) {
				target.SendMessage( message, argumentSource.GetType().GetField( argumentSourceField ).GetValue( argumentSource ) );
			} else if ( !String.IsNullOrEmpty ( argument ) ) {
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
		root.ReleaseWidget ();
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
		if ( isDown ) {
			currentStyle = styles.active;
		} else if ( CheckMouseOver() ) {
			currentStyle = styles.hover;
		} else { 
			currentStyle = styles.basic;
		}

		// Mouse
		mouseRct = drawRct;
	}

	
	////////////////////
	// Draw
	////////////////////
	override function DrawSkin () {
		if ( currentStyle == null ) { return; }
		
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );

		if ( enableImage ) {
			OGDrawHelper.DrawSprite ( GetImageRect(), styles.thumb, drawDepth, tint, clipTo );
		}
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, clipTo );
	}
}
