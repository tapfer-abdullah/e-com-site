"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import React from "react";
import { RxCross1 } from "react-icons/rx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DBModal = ({ children, open, handleClose }) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="w-1/2">
            <button onClick={handleClose} className="absolute -top-4 -right-4 text-lg text-white font-bold bg-red-500 p-2 rounded-full transition-all duration-300 hover:bg-red-600 cursor-pointer">
              <RxCross1 />
            </button>
            {children}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default DBModal;
