function product({ size }: { size?: number }) {
  return (
    <svg
      fill="currentColor"
      height={size || 25}
      width={size || 25}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 376.138 376.138"
      xmlSpace="preserve"
    >
      <g>
        <path
          d="M375.631,213.977c1.253-20.954-16.385-45.671-69.666-52.282c-17.238-2.14-33.983-7.308-49.077-13.569
		c-17.089,15.38-11.409,30.765-11.152,31.429c1.59,3.825-0.238,8.174-4.063,9.764c-0.932,0.387-1.898,0.57-2.85,0.57
		c-2.955,0-5.769-1.765-6.972-4.658c-0.41-0.988-8.967-22.445,10.414-43.716c-8.226-4.025-15.732-8.207-22.273-12.141
		c-22.953,16.849-15.866,34.858-15.787,35.05c1.591,3.825-0.222,8.214-4.046,9.804c-0.941,0.392-1.917,0.577-2.876,0.577
		c-2.939,0-5.73-1.739-6.929-4.623c-4.068-9.787-4.834-31.1,16.279-49.319c-8.61-5.808-13.67-9.886-13.848-10.03
		c-17.964-14.395-26.042-19.015-33.243-19.015c-8.768,0-12.913,6.812-16.923,13.4c-4.132,6.789-9.79,16.086-22.753,25.099
		c-9.498,6.602-19.393,9.951-29.411,9.952c-0.003,0-0.002,0-0.005,0c-25.266,0-46.428-20.686-56.792-33.016
		c-1.472-1.751-3.658-2.748-5.949-2.671c-2.286,0.063-4.419,1.166-5.792,2.996C4.037,131.416-3.114,163.258,1.242,199.663
		c2.724,22.775,9.066,40.525,11.222,46.085l-1.994,30.406c-0.187,2.096,0.517,4.175,1.936,5.728
		c1.421,1.553,3.429,2.438,5.534,2.438h297.9c21.565,0,37.785-12.226,48.212-24.503C379.009,242.2,376.036,216.697,375.631,213.977z
		 M352.618,248.106c-7.444,8.767-19.818,21.212-36.777,21.212H26.137l0.818-17.195l302.085-0.19c9.462,0,18.286-2.426,25.662-6.598
		C354.068,246.282,353.379,247.209,352.618,248.106z"
        />
      </g>
    </svg>
  );
}

function comment({ size }: { size?: number }) {
  return (
    <svg
      fill="currentColor"
      height={size || 25}
      width={size || 25}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 60 60"
      xmlSpace="preserve"
    >
      <path
        d="M54,2H6C2.748,2,0,4.748,0,8v33c0,3.252,2.748,6,6,6h28.558l9.702,10.673C44.453,57.885,44.724,58,45,58
 c0.121,0,0.243-0.022,0.36-0.067C45.746,57.784,46,57.413,46,57V47h8c3.252,0,6-2.748,6-6V8C60,4.748,57.252,2,54,2z M12,15h15
 c0.553,0,1,0.448,1,1s-0.447,1-1,1H12c-0.553,0-1-0.448-1-1S11.447,15,12,15z M46,33H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34
 c0.553,0,1,0.448,1,1S46.553,33,46,33z M46,25H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34c0.553,0,1,0.448,1,1S46.553,25,46,25z"
      />
    </svg>
  );
}

export { product, comment };