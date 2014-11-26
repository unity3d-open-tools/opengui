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
	public var func : Function;
	public var hoverFunc : Function;


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

		if ( hoverFunc ) {
			hoverFunc ();
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
		if ( func ) {
			func ();
		}
		
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
		
		// Styles
		if ( isSelected ) {
			currentStyle = this.styles.hover;
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
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, clipTo );
	}
}
