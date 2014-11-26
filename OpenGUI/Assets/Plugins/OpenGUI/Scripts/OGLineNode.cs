using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class OGLineNode : OGWidget {
	public enum LineType {
		Straight,
		Bezier
	}

	[System.Serializable]
	public class Connection {	
		public OGLineNode node;
		public Vector3[] segments = new Vector3 [0];
		
		public Connection ( OGLineNode node ) {
			this.node = node;
		}

		public Connection ( OGLineNode node, Vector3[] segments ) {
			this.node = node;
			this.segments = segments;
		}

		public void SetSegment ( int i, Vector3 segment ) {
			List< Vector3 > tmp = new List< Vector3 > ( segments );

			tmp.Insert ( i, segment );

			segments = tmp.ToArray ();
		}
	}

	public LineType lineType;
	public Connection[] connections = new Connection [ 0 ];

	public void AddConnection ( OGLineNode node ) {
		AddConnection ( node, new Vector3 [0] );
	}
	
	public void AddConnection ( OGLineNode node, Vector3[] segments ) {
		List< Connection > tmp = new List< Connection > ( connections );
		
		tmp.Add ( new Connection ( node, segments ) );

		connections = tmp.ToArray ();
	}
	
	public void SetConnection ( int i, OGLineNode node ) {
		SetConnection ( i, node, new Vector3 [0] );
	}

	public void SetConnection ( int i, OGLineNode node, Vector3[] segments ) {
		List< Connection > tmp = new List< Connection > ( connections );

		if ( i >= tmp.Count ) {
			for ( int n = tmp.Count; n <= i; n++ ) {
				tmp.Add ( null );
			}
		}

		tmp[i] = new Connection ( node, segments );

		connections = tmp.ToArray ();
	}

	private static Vector2 ToVector2 (Vector3 v) {
		return new Vector2 (v.x, v.y);
	}

	override public void DrawLine () {
		for ( int i = 0; i < connections.Length; i++ ) {
			if ( connections[i] != null && connections[i].node != null ) {
				if ( lineType == LineType.Straight ) {
					if ( connections[i].segments.Length == 0 ) {
						OGDrawHelper.DrawLine ( drawRct.center, connections[i].node.drawRct.center, drawDepth );
					
					} else {
						for ( int s = 0; s < connections[i].segments.Length; s++ ) {
							if ( s == 0 ) {
								OGDrawHelper.DrawLine ( drawRct.center, drawRct.center + ToVector2(connections[i].segments[s]), drawDepth );
								
							} else if ( s == connections[i].segments.Length - 1 ) {
								OGDrawHelper.DrawLine ( drawRct.center + ToVector2(connections[i].segments[s-1]), drawRct.center + ToVector2(connections[i].segments[s]), drawDepth );
								OGDrawHelper.DrawLine ( drawRct.center + ToVector2(connections[i].segments[s]), connections[i].node.drawRct.center, drawDepth );
							
							} else {
								OGDrawHelper.DrawLine ( drawRct.center + ToVector2(connections[i].segments[s-1]), drawRct.center + ToVector2(connections[i].segments[s]), drawDepth );
							
							}
						}
					}
				
				} else {
					Vector3 startDir = Vector3.zero;
					Vector3 endDir = Vector3.zero;

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
