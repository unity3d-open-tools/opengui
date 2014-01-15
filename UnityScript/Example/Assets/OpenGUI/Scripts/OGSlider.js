#pragma strict

public class OGSlider extends OGWidget {
	public var sliderValue : float = 0;
	public var sliderLabel : OGLabel;
	public var backgroundHeight : float = 0.25;
	public var toPercent : boolean = true;
	public var suffix : String = "";
	

	////////////////
	// Rects
	////////////////
	private function GetThumbRect () : Rect {
		return new Rect ( drawRct.x + ( sliderValue * drawRct.width ) - ( drawRct.height / 2 ), drawRct.y, drawRct.height, drawRct.height );
	}

	private function GetBackgroundRect () : Rect {
		return new Rect ( drawRct.x, drawRct.y + ( drawRct.height / 2 ) - ( ( drawRct.height * backgroundHeight ) / 2 ), drawRct.width, drawRct.height * backgroundHeight );
	}


	////////////////
	// Mouse
	////////////////
	override function OnMouseDrag () {
		if ( sliderValue >= 0 && sliderValue <= 1 ) {
			sliderValue = ( Input.mousePosition.x - 10 - this.transform.position.x ) / this.transform.lossyScale.x;
		}
	

		sliderValue = Mathf.Clamp ( Mathf.Round ( sliderValue * 100 ) / 100, 0, 1 );

		if ( sliderLabel ) {
			if ( toPercent ) {
				sliderLabel.text = ( sliderValue * 100 ).ToString() + suffix;
			} else {
				sliderLabel.text = sliderValue.ToString() + suffix;
			}	
		}
	}

	override function OnMouseCancel () {
		GetRoot().ReleaseWidget();
	}
	
	override function OnMouseUp () {
		GetRoot().ReleaseWidget();
	}
	

	////////////////
	// Update
	////////////////	
	override function UpdateWidget () {
		// Mouse
		mouseRct = CombineRects ( GetThumbRect(), GetBackgroundRect() );
	}
	
	
	////////////////
	// Draw
	////////////////	
	override function DrawSkin () {
		// Background
		OGDrawHelper.DrawSprite ( GetBackgroundRect(), styles.basic.coordinates, drawDepth );
	
		// Thumb
		OGDrawHelper.DrawSlicedSprite ( GetThumbRect(), styles.thumb.coordinates, styles.thumb.border, drawDepth );
	}
}
