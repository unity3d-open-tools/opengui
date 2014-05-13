#pragma strict

public class ProceduralExample extends OGFieldContainer {
	private var testBool : boolean;
	private var testFloat : float;
	private var testInt : int;
	
	override function Fields () {
		testBool = Toggle ( "Toggle", testBool );
		testFloat = FloatField ( "Float", testFloat );
		testInt = FloatField ( "Int", testInt );

		if ( Button ( "Reset" ) ) {
			testBool = false;
			testFloat = 0;
			testInt = 0;
		}
	}
}
