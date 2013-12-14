#pragma strict

public class OGSlider extends OGWidget {
	public var sliderValue : float = 0;
	
	private var background : OGSprite;
	private var thumb : OGSlicedSprite;
	
	private function RestrictSlider () {
		sliderValue = System.Math.Round ( sliderValue, 2 );
		if ( sliderValue < 0 ) { sliderValue = 0; }
		else if ( sliderValue > 1 ) { sliderValue = 1; }
	}
	
	override function OnMouseDrag () {
		if ( sliderValue >= 0 && sliderValue <= 1 ) {
			sliderValue = ( Input.mousePosition.x - 10 - this.transform.position.x ) / this.transform.lossyScale.x;
		}
		
		RestrictSlider ();
	}
	
	override function UpdateWidget () {
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSprite );
				
			} else {			
				var newSprite : OGSprite = new GameObject ( "Sprite", OGSprite ).GetComponent ( OGSprite );
				newSprite.transform.parent = this.transform;
				newSprite.styles.basic = this.styles.basic;
			}
		
		} else {
			background.transform.localScale = new Vector3 ( 1, 0.25, 1 );
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = new Vector3 ( 0, 0.5, 1 );
			
			background.pivot.x = RelativeX.Left;
			background.pivot.y = RelativeY.Center;
			
			background.styles.basic = this.styles.basic;
			background.hidden = true;
			background.isDrawn = isDrawn;
		}
		
		// Thumb		
		if ( thumb == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				thumb = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newThumb : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newThumb.transform.parent = this.transform;
				newThumb.styles.basic = this.styles.thumb;
			}
		
		} else {
			thumb.transform.localScale = new Vector3 ( this.transform.lossyScale.y / this.transform.lossyScale.x, 1, 1 );
			thumb.transform.localEulerAngles = Vector3.zero;
			thumb.transform.localPosition = new Vector3 ( sliderValue, 0.5, 0 );
			
			thumb.pivot.x = RelativeX.Center;
			thumb.pivot.y = RelativeY.Center;
			thumb.styles.basic = this.styles.thumb;
			thumb.hidden = true;
			thumb.isDrawn = isDrawn;
		
			mouseRct = CombineRects ( thumb.drawRct, background.drawRct );
		}
		
		// Slider
		this.pivot.x = RelativeX.Left;
		this.pivot.y = RelativeY.Center;
		
		RestrictSlider ();
	}
}
