#pragma strict

public class OGLineNode extends OGWidget {
	public enum LineType {
		Straight,
		Bezier
	}

	public class Connection {	
		public var node : OGLineNode;
		public var segments : Vector3 [] = new Vector3 [0];
		
		function Connection ( node : OGLineNode ) {
			this.node = node;
		}

		function Connection ( node : OGLineNode, segments : Vector3 [] ) {
			this.node = node;
			this.segments = segments;
		}

		public function SetSegment ( i : int, segment : Vector3 ) {
			var tmp : List.< Vector3 > = new List.< Vector3 > ( segments );

			tmp.Insert ( i, segment );

			segments = tmp.ToArray ();
		}
	}

	public var lineType : LineType;
	public var connections : Connection [] = new Connection [ 0 ];

	public function AddConnection ( node : OGLineNode ) {
		AddConnection ( node, new Vector3 [0] );
	}
	
	public function AddConnection ( node : OGLineNode, segments : Vector3 [] ) {
		var tmp : List.< Connection > = new List.< Connection > ( connections );
		
		tmp.Add ( new Connection ( node, segments ) );

		connections = tmp.ToArray ();
	}
	
	public function SetConnection ( i : int, node : OGLineNode ) {
		SetConnection ( i, node, new Vector3 [0] );
	}

	public function SetConnection ( i : int, node : OGLineNode, segments : Vector3 [] ) {
		var tmp : List.< Connection > = new List.< Connection > ( connections );

		if ( i >= tmp.Count ) {
			for ( var n : int = tmp.Count; n <= i; n++ ) {
				tmp.Add ( null );
			}
		}

		tmp[i] = new Connection ( node, segments );

		connections = tmp.ToArray ();
	}

	override function DrawLine () {
		for ( var i : int = 0; i < connections.Length; i++ ) {
			if ( connections[i] != null && connections[i].node != null ) {
				if ( lineType == LineType.Straight ) {
					if ( connections[i].segments.Length == 0 ) {
						OGDrawHelper.DrawLine ( drawRct.center, connections[i].node.drawRct.center, drawDepth );
					
					} else {
						for ( var s : int = 0; s < connections[i].segments.Length; s++ ) {
							if ( s == 0 ) {
								OGDrawHelper.DrawLine ( drawRct.center, drawRct.center + connections[i].segments[s], drawDepth );
								
							} else if ( s == connections[i].segments.Length - 1 ) {
								OGDrawHelper.DrawLine ( drawRct.center + connections[i].segments[s-1], drawRct.center + connections[i].segments[s], drawDepth );
								OGDrawHelper.DrawLine ( drawRct.center + connections[i].segments[s], connections[i].node.drawRct.center, drawDepth );
							
							} else {
								OGDrawHelper.DrawLine ( drawRct.center + connections[i].segments[s-1], drawRct.center + connections[i].segments[s], drawDepth );
							
							}
						}
					}
				
				} else {
					var startDir : Vector3;
					var endDir : Vector3;

					if ( connections[i].segments.Length > 0 ) {
						startDir = connections[i].segments[0];
					}

					if ( connections[i].segments.Length > 1 ) {
						endDir = connections[i].segments[1];
					}

					OGDrawHelper.DrawCurve ( drawRct.center, startDir, endDir, connections[i].node.drawRct.center, 10 ); 

				}
			}
		}
	}
}
