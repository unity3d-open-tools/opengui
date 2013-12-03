
Shader "GUI/Alpha Sliced" {
	Properties {
		_MainTex ("Texture", 2D) = "white" {}
		_ClipRect ( "Clipping", Vector ) = ( 0, 0, 0, 0 )
		_Color ("Color", Color ) = (1,1,1,1)
	}

	SubShader {
		Lighting Off      

		Tags {
			"RenderType"="Transparent"
			"Queue"="Transparent"
			"IgnoreProjector"="True"
		}

		CGPROGRAM
		#pragma surface surf Lambert alpha

		struct Input {
			float2 uv_MainTex;
			float3 worldPos;
		};

		sampler2D _MainTex;
		float4 _ClipRect;
		float4 _Color;

		void surf (Input IN, inout SurfaceOutput o) {
			if ( (IN.worldPos.x<_ClipRect.x) || (IN.worldPos.x>_ClipRect.y) || (IN.worldPos.y<_ClipRect.z) || (IN.worldPos.y>_ClipRect.w) ) {
				o.Albedo = half3 ( 0,0,0 );
				o.Alpha = 0;
			} else {
				o.Albedo = tex2D (_MainTex, IN.uv_MainTex).rgb * _Color.rgb;
				o.Alpha = tex2D (_MainTex, IN.uv_MainTex).a * _Color.a;		
			}
		}

		ENDCG
	} 
 	
	Fallback "Diffuse"
}
