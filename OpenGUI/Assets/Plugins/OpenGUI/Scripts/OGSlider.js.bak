#pragma strict

public class OGSlider extends OGWidget {
	public enum Orientation {
		Horizontal,
		Vertical
	}
		
	public var orientation : Orientation;
	public var sliderValue : float = 0;
	public var sliderLabel : OGLabel;
	public var backgroundHeight : float = 0.25;
	public var toPercent : boolean = true;
	public var suffix : String = "";
	

	////////////////
	// Rects
	////////////////
	private function GetThumbRect () : Rect {
		if ( orientation == Orientation.Horizontal ) {
			return new Rect ( drawRct.x + ( sliderValue * drawRct.width ) - ( drawRct.height / 2 ), drawRct.y, drawRct.height, drawRct.height );
		} else {
			return new Rect ( drawRct.x, drawRct.y + ( sliderValue * drawRct.height ) - ( drawRct.width / 2 ), drawRct.width, drawRct.width );
		}
	}

	private function GetBackgroundRect () : Rect {
		if ( orientation == Orientation.Horizontal ) {
			return new Rect ( drawRct.x, drawRct.y + ( drawRct.height / 2 ) - ( ( drawRct.height * backgroundHeight ) / 2 ), drawRct.width, drawRct.height * backgroundHeight );
		} else {
			return new Rect ( drawRct.x + ( drawRct.width / 2 ) - ( ( drawRct.width * backgroundHeight ) / 2 ), drawRct.y, drawRct.width * backgroundHeight, drawRct.height );
		}
	}


	////////////////
	// Mouse
	////////////////
	override function OnMouseDrag () {
		if ( sliderValue >= 0 && sliderValue <= 1 ) {
			if ( orientation == Orientation.Horizontal ) {
				sliderValue = ( Input.mousePosition.x - drawRct.x ) / drawRct.width;
			} else {
				sliderValue = ( Input.mousePosition.y - drawRct.y ) / drawRct.height;
			}
		}
	

		sliderValue = Mathf.Clamp ( Mathf.Round ( sliderValue * 100 ) / 100, 0, 1 );
	}

	override function OnMouseCancel () {
		root.ReleaseWidget();
	}
	
	override function OnMouseUp () {
		root.ReleaseWidget();
	}
	

	////////////////
	// Update
	////////////////	
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;
		
		// Mouse
		mouseRct = CombineRects ( GetThumbRect(), GetBackgroundRect() );
		
		// Update data
		if ( sliderLabel ) {
			if ( toPercent ) {
				sliderLabel.text = ( sliderValue * 100 ).ToString() + suffix;
			} else {
				sliderLabel.text = sliderValue.ToString() + suffix;
			}	
		}
	}
	
	
	////////////////
	// Draw
	////////////////	
	override function DrawSkin () {
		// Background
		OGDrawHelper.DrawSprite ( GetBackgroundRect(), styles.basic, drawDepth, tint, clipTo );
	
		// Thumb
		OGDrawHelper.DrawSlicedSprite ( GetThumbRect(), styles.thumb, drawDepth, tint, clipTo );
	}		
}
