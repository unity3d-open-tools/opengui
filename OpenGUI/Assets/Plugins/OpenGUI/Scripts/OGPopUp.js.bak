#pragma strict

class OGPopUp extends OGWidget {	
	public var title : String = "";
	public var options : String[];
	public var selectedOption : String;
	public var target : GameObject;
	public var message : String;
	public var passSelectedOption : boolean = false;
	public var isUp = false;
	
	private var timeStamp : float;
	
	
	////////////////////
	// Data
	////////////////////
	public function get selectedIndex () : int {
		for ( var i : int = 0; i < options.Length; i++ ) {
			if ( selectedOption == options[i] ) {
				return i;
			}
		}

		return 0;
	}


	////////////////////
	// Options
	////////////////////
	private function GetOptionRect ( i : int ) : Rect {
		var bottom : float = drawRct.y - options.Length * drawRct.height;
		var top : float = drawRct.y + options.Length * drawRct.height;

		if ( bottom < 0 || clipTo && bottom < clipTo.drawRct.y ) {
			return new Rect ( drawRct.x, top - ( i * ( drawRct.height + styles.active.text.padding.bottom ) ), drawRct.width, drawRct.height );
		} else {
			return new Rect ( drawRct.x, drawRct.y - ( ( 1 + i ) * drawRct.height ), drawRct.width, drawRct.height );
		}
	}
	
	private function GetOptionStyle ( i : int ) : OGStyle {
		return ( CheckMouseOver ( GetOptionRect ( i ) ) ) ? styles.hover : styles.active;
	}

	private function GetMouseOverOption () : int {
		for ( var i : int = 0; i < options.Length; i++ ) {
			if ( CheckMouseOver ( GetOptionRect ( i ) ) ) {
				return i;
			}
		}
		
		return -1;
	}

	private function GetThumbRect () : Rect {
		return new Rect ( drawRct.x + drawRct.width - drawRct.height - styles.basic.text.padding.right, drawRct.y, drawRct.height, drawRct.height );
	}

	private function GetExpandedRect () : Rect {
		var totalHeight : float = styles.active.text.padding.bottom + styles.active.text.padding.top + drawRct.height + options.Length * drawRct.height;
		var bottom : float = drawRct.y - totalHeight + drawRct.height;
		
		if ( bottom < 0 || clipTo && bottom < clipTo.drawRct.y ) {
			return new Rect ( drawRct.x, drawRct.y, drawRct.width, totalHeight );
		} else {
			return new Rect ( drawRct.x, bottom, drawRct.width, totalHeight );
		}
	}

	public function SetOptions ( list : String[] ) {
		options = list;
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
		
			isUp = false;
		}
	}
	
	override function OnMouseDown () {
		if ( !isUp && GetMouseOverOption() == -1 ) {		
			isUp = true;
			timeStamp = Time.time;
		}
	}
	
	override function OnMouseCancel () {
		isUp = false;
		
		OGRoot.GetInstance().ReleaseWidget ();
	}


	////////////////////
	// Update
	////////////////////
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;
		
		// Update data
		isAlwaysOnTop = isUp;

		// Mouse
		if ( isUp ) {
			mouseRct = GetExpandedRect ();
		} else {
			mouseRct = drawRct;
		}

		// Styles
		if ( isUp ) {
			currentStyle = styles.active;
		} else {
			currentStyle = styles.basic;
		}
	}


	///////////////////
	// Draw
	///////////////////
	override function DrawSkin () {
		if ( isUp ) {
			OGDrawHelper.DrawSlicedSprite ( GetExpandedRect(), currentStyle, drawDepth, tint, clipTo );
			
			for ( var i : int = 0; i < options.Length; i++ ) {
				if ( GetOptionStyle ( i ) == styles.hover ) {
					OGDrawHelper.DrawSprite ( GetOptionRect ( i ), styles.hover, drawDepth, tint, clipTo );
				}
			}

		} else {
			OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
			OGDrawHelper.DrawSprite ( GetThumbRect (), styles.thumb, drawDepth, tint, clipTo );
		}
	}	
	
	override function DrawText () {
		if ( isUp ) {
			OGDrawHelper.DrawLabel ( drawRct, title, styles.basic.text, drawDepth, tint, clipTo );

			for ( var i : int = 0; i < options.Length; i++ ) {
				OGDrawHelper.DrawLabel ( GetOptionRect ( i ), options[i], GetOptionStyle ( i ).text, drawDepth, tint, clipTo );
			}
		
		} else if ( !String.IsNullOrEmpty ( selectedOption ) ) {
			OGDrawHelper.DrawLabel ( drawRct, selectedOption, currentStyle.text, drawDepth, tint, clipTo );
			
		} else {
			OGDrawHelper.DrawLabel ( drawRct, title, currentStyle.text, drawDepth, tint, clipTo );
			
		}
	}
}
