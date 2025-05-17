"use client";

import CallContract from "../components/CallContract";

export default function page() {
  return (
    <>
      <CallContract
        call3data={[
          {
            target: "0x0000000000000000000000000000000000000000",
            allowFailure: false,
            callData: "0x0000000000000000000000000000000000000000",
          },
        ]}
      />
    </>
  );
}
