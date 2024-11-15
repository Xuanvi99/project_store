import { cn } from "../../utils";

function IconDelete({
  size,
  className,
  onClick,
}: {
  size: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        `relative group/iconDelete cursor-pointer w-[${size}px]`,
        className
      )}
    >
      <div className="absolute top-0 left-0 duration-300 group-hover/iconDelete:top-[-10px] group-hover/iconDelete:rotate-45">
        <IconDeleteLid size={size}></IconDeleteLid>
      </div>
      <div>
        <IconDeleteBin size={size}></IconDeleteBin>
      </div>
    </div>
  );
}

const IconDeleteLid = ({ size }: { size: number }) => {
  return (
    <svg
      fill="currentColor"
      width={size}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <g>
            <path
              d="M307.2,0H204.8c-4.71,0-8.533,5.086-8.533,11.375V25.6c0,4.71,3.823,8.533,8.533,8.533h102.4
  c4.71,0,8.533-3.823,8.533-8.533V11.375C315.733,5.086,311.91,0,307.2,0z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M477.867,51.2H315.733H196.267H34.133c-4.71,0-8.533,3.396-8.533,7.586v53.094c0,4.19,3.823,7.586,8.533,7.586h443.733
  c4.719,0,8.533-3.396,8.533-7.586V58.786C486.4,54.596,482.586,51.2,477.867,51.2z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

const IconDeleteBin = ({ size }: { size: number }) => {
  return (
    <svg
      fill="currentColor"
      height={size}
      width={size}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path
            d="M450.039,136.533H61.961c-4.932,0-8.832,4.164-8.516,9.088l23.373,358.4c0.299,4.489,4.019,7.979,8.516,7.979h341.333
  c4.497,0,8.226-3.49,8.516-7.979l23.373-358.4C458.88,140.698,454.972,136.533,450.039,136.533z M170.667,418.133
  c0,4.719-3.823,8.533-8.533,8.533c-4.71,0-8.533-3.814-8.533-8.533V196.267c0-4.719,3.823-8.533,8.533-8.533
  c4.71,0,8.533,3.814,8.533,8.533V418.133z M264.533,418.133c0,4.719-3.823,8.533-8.533,8.533s-8.533-3.814-8.533-8.533V196.267
  c0-4.719,3.823-8.533,8.533-8.533s8.533,3.814,8.533,8.533V418.133z M358.4,418.133c0,4.719-3.823,8.533-8.533,8.533
  s-8.533-3.814-8.533-8.533V196.267c0-4.719,3.823-8.533,8.533-8.533s8.533,3.814,8.533,8.533V418.133z"
          />
        </g>
      </g>
    </svg>
  );
};

export default IconDelete;
