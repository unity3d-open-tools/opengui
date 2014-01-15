#pragma strict

class OGListItem extends OGWidget {
	public var text : String = "";
	public var selected : boolean = false;
	public var isTicked : boolean = false;
	public var object : Object;
	public var target : GameObject;
	public var message : String;
	public var hoverMessage : String;
	public var argument : String;


	//////////////////
	// Interaction
	//////////////////
	private function Select () {
		selected = true;

		for ( var li : OGListItem in this.transform.parent.GetComponentsInChildren.<OGListItem>() ) {
			if ( li != this ) {
				li.selected = false;
			}
		}

		if ( target != null ) {
			if ( !String.IsNullOrEmpty ( hoverMessage ) ) {
				if ( !String.IsNullOrEmpty ( argument ) ) {
					target.SendMessage ( hoverMessage, argument );
				
				} else if ( object != null ) {
					target.SendMessage ( hoverMessage, object );
				
				} else {
					target.SendMessage ( hoverMessage, this );

				}
			}
		}
	}

	private function Action () {
		if ( target != null ) {
			if ( !String.IsNullOrEmpty ( message ) ) {
				if ( !String.IsNullOrEmpty ( argument ) ) {
					target.SendMessage ( message, argument );
				
				} else if ( object != null ) {
					target.SendMessage ( message, object );
				
				} else {
					target.SendMessage ( message, this );

				}
			}
		}
	}

	override function OnMouseCancel () {
		OGRoot.GetInstance().ReleaseWidget ();
	}

	override function OnMouseUp () {
		Action ();
	}

	override function OnMouseOver () {
		if ( !selected ) {
			Select ();
		}
	}
	
	//////////////////
	// Update
	//////////////////
	override function UpdateWidget () {
		// Mouse
		mouseRct = drawRct;

		// Update data
		if ( disabled ) {
			currentStyle = this.styles.disabled;
		} else if ( isTicked ) {
			currentStyle = this.styles.ticked;
		} else if ( selected ) {
			currentStyle = this.styles.active;
		} else {
			currentStyle = this.styles.basic;
		}

	}

	//////////////////
	// Draw
	//////////////////
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle.coordinates, currentStyle.border, drawDepth );
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth );
	}
}
