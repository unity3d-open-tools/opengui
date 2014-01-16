#pragma strict

class OGListItem extends OGWidget {
	public var text : String = "";
	public var isSelected : boolean = false;
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
		isSelected = true;

		for ( var li : OGListItem in this.transform.parent.GetComponentsInChildren.<OGListItem>() ) {
			if ( li != this ) {
				li.isSelected = false;
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

	private function Tick () {
		isTicked = true;

		for ( var li : OGListItem in this.transform.parent.GetComponentsInChildren.<OGListItem>() ) {
			if ( li != this ) {
				li.isTicked = false;
			}
		}
	}

	override function OnMouseCancel () {
		isSelected = false;
	}

	override function OnMouseDown () {
		if ( !isDisabled ) {
			Action ();
			Tick ();
		}
	}

	override function OnMouseOver () {
		if ( !isSelected && !isDisabled  ) {
			Select ();
		}
	}


	//////////////////
	// Update
	//////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		// Mouse
		mouseRct = drawRct;

		// ^ Cancel check
		if ( !CheckMouseOver ( mouseRct ) ) { OnMouseCancel(); }
		
		// Update data
		if ( isDisabled ) {
			currentStyle = this.styles.disabled;
		} else if ( isSelected ) {
			currentStyle = this.styles.active;
		} else if ( isTicked ) {
			currentStyle = this.styles.ticked;
		} else {
			currentStyle = this.styles.basic;
		}

	}

	//////////////////
	// Draw
	//////////////////
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle.coordinates, currentStyle.border, drawDepth, clipTo );
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, clipTo );
	}
}
