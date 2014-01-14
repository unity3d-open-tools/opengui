#pragma strict

public class OGProgressBar extends OGWidget {
	public var value : float = 0.5;
	public var padding : Vector2;

	public function SetValue ( value : float ) {
		if ( this.value == value ) { return; }
		
		this.value = value;
		value = Mathf.Clamp ( value, 0, 1 );

		SetDirty();
	}

	private function GetThumbRect () : Rect {
		return new Rect ( drawRct.x + padding.x, drawRct.y + padding.y, ( drawRct.width - ( padding.x * 2 ) ) * value, drawRct.height - ( padding.y*2 ) );
	}
		
	
	/////////////////
	// Clean up
	/////////////////
	override function ClearChildren () {
		for ( var i : int = 0; i < transform.childCount; i++ ) {
			DestroyImmediate ( transform.GetChild ( i ).gameObject );
		}
	}

	
	/////////////////
	// Draw
	/////////////////
	override function DrawSkin () {
		// Background
		OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic.coordinates, styles.basic.border, drawDepth );

		// Thumb
		OGDrawHelper.DrawSprite ( GetThumbRect (), styles.thumb.coordinates, drawDepth ); 
	}


	/////////////////
	// Update
	/////////////////
	override function UpdateWidget () {
		// Update data
	}
}
