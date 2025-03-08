const express = require("express");
const bodyParser = require("body-parser");
const { Printer } = require("@node-escpos/core");
const USB = require("@node-escpos/usb-adapter");
const cors = require("cors");
const dayjs = require("dayjs");
const advancedFormat = require("dayjs/plugin/advancedFormat");

dayjs.extend(advancedFormat);

const app = express();
const PORT = 7070;
const API_KEY = process.env.POS_PRINT_API_KEY || "pos-gamja";

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Middleware for API key authentication
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
});

// Currency formatter
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// Text alignment helper

const LINE_WIDTH = 48; // For 80mm paper
const DESCRIPTION_WIDTH = 38; // LINE_WIDTH - price column (10 chars)

// Modified createColumns function
function createColumns(left, right, width = LINE_WIDTH) {
  const spaceCount = width - left.length - right.length;
  if (spaceCount < 0) {
    // Truncate left side if needed
    const truncateLength = width - right.length - 3; // Allow for ellipsis
    return left.substring(0, truncateLength) + '...' + right;
  }
  return left + ' '.repeat(spaceCount > 0 ? spaceCount : 1) + right;
}
// Word wrap function (same as previous)
/**
 * Word wrap function to split a string into lines without breaking words.
 * @param {string} text
 * @param {number} maxChars
 * @returns {string[]}
 */
function wordWrap(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length > maxChars) {
      if (currentLine.length > 0) {
        lines.push(currentLine.trim());
        currentLine = "";
      }
    }
    currentLine += `${word} `;
  });

  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim());
  }

  return lines;
}




// Printer initialization helper
async function handlePrint(printCallback) {
  const device = new USB(0x0483, 0x5743); // Update with your printer's VID/PID
  const printer = new Printer(device, { encoding: "GB18030" });

  return new Promise((resolve, reject) => {
    device.open(async (err) => {
      if (err) return reject(err);

      try {
        await printCallback(printer);
        printer.close();
        resolve();
      } catch (error) {
        printer.close();
        reject(error);
      }
    });
  });
}

// Receipt printing endpoint
app.post("/print/receipt", async (req, res) => {
  const {
    transactionId,
    items,
    subtotal,
    tax,
    total,
    paymentMethod,
    cashReceived,
    change,
    createdAt = new Date()
  } = req.body;

  try {
    await handlePrint(async (printer) => {
      // Header Section
      printer
        .align("CT")
        .size(2, 2)
        .text("Brothers Convenience")
        .size(1, 1)
        .text("2231 Victoria Park Ave")
        .text("Toronto, ON M1R 1V8")
        .text("Tel: (416) 445-5427")
        .text(dayjs(createdAt).format("YYYY-MM-DD h:mm A"))
        .text(`Transaction #: ${transactionId}`)
        .text("-".repeat(LINE_WIDTH));

      // Items Section
      items.forEach((item) => {
        const description = `${item.quantity}x ${item.title}`;
        const wrappedLines = wordWrap(description, DESCRIPTION_WIDTH);
      
        wrappedLines.forEach((line, index) => {
          if (index === wrappedLines.length - 1) {
            // Last line with price
            printer.text(
              createColumns(line, formatCurrency(item.price * item.quantity))
            );
          } else {
            printer.text(line);
          }
        });
      });

      // Totals Section
      printer
        .text("-".repeat(LINE_WIDTH))
        .text(createColumns("Subtotal:", formatCurrency(subtotal)))
        .text(createColumns("Tax (13% HST):", formatCurrency(tax)))
        .text(createColumns("Total:", formatCurrency(total)))
        .text("-".repeat(LINE_WIDTH));

      // Payment Section
      printer.text(`Payment Method: ${paymentMethod}`);
      if (paymentMethod === "CASH") {
        printer
          .text(createColumns("Amount Received:", formatCurrency(cashReceived)))
          .text(createColumns("Change Given:", formatCurrency(change)));
      }

      // Footer Section
      printer
        .text("-".repeat(LINE_WIDTH))
        .align("CT")
        .text("Thank you for your purchase!")
        .text("Come check out our flowers!")
        .text("")
        .text("")
        .text(" ")
        .text(" ")
        .cut();
    });

    res.json({ success: true, message: "Receipt printed successfully" });
  } catch (error) {
    console.error("Print error:", error);
    res.status(500).json({ error: "Failed to print receipt" });
  }
});

// Cash drawer endpoint
app.post("/open/cash-drawer", async (req, res) => {
  try {
    await handlePrint(printer => printer.cashdraw(2));
    res.json({ success: true, message: "Cash drawer opened" });
  } catch (error) {
    res.status(500).json({ error: "Failed to open cash drawer" });
  }
});

app.listen(PORT, () => {
  console.log(`POS Printer Service running on port ${PORT}`);
});