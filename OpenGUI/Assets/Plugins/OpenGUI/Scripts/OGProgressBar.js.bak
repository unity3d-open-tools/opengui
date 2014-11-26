#pragma strict

public class OGProgressBar extends OGWidget {
	public enum LayoutType {
		Horizontal,
		Vertical
	}

	public var value : float = 0.5;
	public var padding : Vector2;
	public var type : LayoutType;

	public function SetValue ( value : float ) {
		if ( this.value == value ) { return; }

		this.value = value;
		value = Mathf.Clamp ( value, 0, 1 );
	}

	private function GetThumbRect () : Rect {
		if ( type == LayoutType.Horizontal ) {
			return new Rect ( drawRct.x + padding.x, drawRct.y + padding.y, ( drawRct.width - ( padding.x * 2 ) ) * value, drawRct.height - ( padding.y * 2 ) );
		} else {
			return new Rect ( drawRct.x + padding.x, drawRct.y + padding.y, ( drawRct.width - ( padding.x * 2 ) ), (drawRct.height - ( padding.y * 2 )) * value );

		}
	}


	/////////////////
	// Draw
	/////////////////
	override function DrawSkin () {
		// Background
		OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic, drawDepth, tint, clipTo );

		// Thumb
		OGDrawHelper.DrawSprite ( GetThumbRect (), styles.thumb, drawDepth, tint, clipTo );
	}
}
