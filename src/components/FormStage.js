"use client"

import { useState, useRef, useEffect, useCallback } from "react"

const FormStage = ({ stage, onFormSubmit, onBack, companyData }) => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0)
  const [formData, setFormData] = useState({})

  // Stage 1 Forms
  const stage1Forms = [
    {
      id: "core-insulation-check",
      title: "Core Insulation Check",
      component: CoreInsulationCheckForm,
    },
    {
      id: "transformer-specifications",
      title: "Transformer Specifications",
      component: TransformerSpecificationsForm,
    },
    {
      id: "pre-erection-checklist",
      title: "Pre-Erection Checklist",
      component: PreErectionChecklistForm,
    },
    {
      id: "tan-delta-test",
      title: "Tan Delta Test",
      component: TanDeltaTestForm,
    },
  ]

  // Stage 2 Forms
  const stage2Forms = [
    {
      id: "test-values-prior-filteration",
      title: "Test Values Prior to Filteration and Oil Filling",
      component: TestValuesPriorFilterationForm,
    },
  ]

  // Stage 3 Forms
  const stage3Forms = [
    {
      id: "ir-after-erection",
      title: "IR After Erection",
      component: IRAfterErectionForm,
    },
    {
      id: "oil-testing-record",
      title: "Record of Oil Testing Prior to Filling in Main Tank",
      component: OilTestingRecordForm,
    },
    {
      id: "ir-after-oil-topping",
      title: "IR After Oil Toping Up to Conservator",
      component: IRAfterOilToppingForm,
    },
    {
      id: "pressure-test-report",
      title: "Pressure Test Report",
      component: PressureTestReportForm,
    },
    {
      id: "oil-filtration-main-tank",
      title: "Record for Oil Filtration - Main Tank",
      component: OilFiltrationMainTankForm,
    },
    {
      id: "oil-filtration-radiator",
      title: "Record for Oil Filtration - Radiator and Combine",
      component: OilFiltrationRadiatorForm,
    },
    {
      id: "ir-value-circulation",
      title: "IR Value During Circulation",
      component: IRValueCirculationForm,
    },
  ]

  // Stage 4 Forms
  const stage4Forms = [
    {
      id: "sfra-test-record",
      title: "SFRA Test Record",
      component: SFRATestRecordForm,
    },
    {
      id: "ir-values-measurement",
      title: "Record of Measurement of IR Values",
      component: IRValuesMeasurementForm,
    },
    {
      id: "tan-delta-capacitance-test",
      title: "Tan Delta and Capacitance Test on Bushing and Winding",
      component: TanDeltaCapacitanceTestForm,
    },
    {
      id: "voltage-ratio-magnetising-test",
      title: "Voltage Ratio Test and Magnetising Current Test",
      component: VoltageRatioMagnetisingTestForm,
    },
    {
      id: "short-circuit-test",
      title: "Short Circuit Test",
      component: ShortCircuitTestForm,
    },
    {
      id: "winding-resistance-ir-pi-test",
      title: "Winding Resistance Test and Record of Measurement of IR & PI Values",
      component: WindingResistanceIRPITestForm,
    },
  ]

  // Stage 5 Forms
  const stage5Forms = [
    {
      id: "pre-charging-checklist",
      title: "Pre-Charging Check List",
      component: PreChargingChecklistForm,
    },
  ]

  // Stage 6 Forms
  const stage6Forms = [
    {
      id: "work-completion-report",
      title: "Work Completion Report",
      component: WorkCompletionReportForm,
    },
  ]

  const getFormsForStage = (stageNumber) => {
    switch (stageNumber) {
      case 1:
        return stage1Forms
      case 2:
        return stage2Forms
      case 3:
        return stage3Forms
      case 4:
        return stage4Forms
      case 5:
        return stage5Forms
      case 6:
        return stage6Forms
      default:
        return []
    }
  }

  const currentForms = getFormsForStage(stage)
  const currentForm = currentForms[currentFormIndex]
  const isLastFormOfStage = currentFormIndex === currentForms.length - 1

  const handleFormSubmit = (data) => {
    const updatedFormData = { ...formData, [currentForm.id]: data }
    setFormData(updatedFormData)

    if (currentFormIndex < currentForms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1)
    } else {
      onFormSubmit(stage, updatedFormData)
    }
  }

  const handlePrevious = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex(currentFormIndex - 1)
    }
  }

  if (!currentForm) {
    return (
      <div className="form-stage-container">
        <div className="form-header">
          <h2>Stage {stage} - No Forms Available</h2>
          <button onClick={onBack} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const FormComponent = currentForm.component

  return (
    <div className="form-stage-container">
      <div className="form-header">
        <div className="form-progress">
          <h2>
            Stage {stage} - Form {currentFormIndex + 1} of {currentForms.length}
          </h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentFormIndex + 1) / currentForms.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <button onClick={onBack} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="form-content">
        <h3>{currentForm.title}</h3>
        <FormComponent
          onSubmit={handleFormSubmit}
          onPrevious={currentFormIndex > 0 ? handlePrevious : null}
          initialData={formData[currentForm.id] || {}}
          companyData={companyData}
          isLastFormOfStage={isLastFormOfStage} // Pass this prop
        />
      </div>
    </div>
  )
}

// Inline Signature Canvas Component Logic
const useSignatureCanvas = (initialDataUrl) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureDataUrl, setSignatureDataUrl] = useState(initialDataUrl || "")
  const lastX = useRef(0)
  const lastY = useRef(0)

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setSignatureDataUrl("")
    }
  }, [])

  const getSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      return canvas.toDataURL("image/png")
    }
    return ""
  }, [])

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const rect = canvas.getBoundingClientRect()

      let clientX, clientY
      if (e.touches) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const currentX = clientX - rect.left
      const currentY = clientY - rect.top

      ctx.beginPath()
      ctx.moveTo(lastX.current, lastY.current)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()

      lastX.current = currentX
      lastY.current = currentY
    },
    [isDrawing],
  )

  const startDrawing = useCallback((e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    lastX.current = clientX - rect.left
    lastY.current = clientY - rect.top
    e.preventDefault() // Prevent scrolling on touch devices
  }, [])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    setSignatureDataUrl(getSignature())
  }, [getSignature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "#000"

      // Load initial signature if available
      if (initialDataUrl) {
        const img = new Image()
        img.crossOrigin = "anonymous" // Set crossOrigin for CORS
        img.src = initialDataUrl
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }
    }
  }, [initialDataUrl])

  return { canvasRef, signatureDataUrl, clearCanvas, startDrawing, draw, stopDrawing }
}

// Stage 1 Form Components
function CoreInsulationCheckForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    coreFrame: initialData.coreFrame || "",
    frameTank: initialData.frameTank || "",
    coreTank: initialData.coreTank || "",
    coreFrameRemarks: initialData.coreFrameRemarks || "",
    frameTankRemarks: initialData.frameTankRemarks || "",
    coreTankRemarks: initialData.coreTankRemarks || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    // Signature data URLs
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>CORE INSULATION CHECK</h3>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Reading (MΩ)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Core to Frame</td>
            <td>
              <input
                type="text"
                value={formData.coreFrame}
                onChange={(e) => setFormData({ ...formData, coreFrame: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreFrameRemarks}
                onChange={(e) => setFormData({ ...formData, coreFrameRemarks: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Frame to Tank</td>
            <td>
              <input
                type="text"
                value={formData.frameTank}
                onChange={(e) => setFormData({ ...formData, frameTank: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.frameTankRemarks}
                onChange={(e) => setFormData({ ...formData, frameTankRemarks: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Core to Tank</td>
            <td>
              <input
                type="text"
                value={formData.coreTank}
                onChange={(e) => setFormData({ ...formData, coreTank: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreTankRemarks}
                onChange={(e) => setFormData({ ...formData, coreTankRemarks: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function TransformerSpecificationsForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    make: initialData.make || "",
    srNo: initialData.srNo || "",
    mvaRating: initialData.mvaRating || "",
    hvKv: initialData.hvKv || "",
    lvKv: initialData.lvKv || "",
    impedance: initialData.impedance || "",
    yearOfMfg: initialData.yearOfMfg || "",
    oilQuantity: initialData.oilQuantity || "",
    transportingWeight: initialData.transportingWeight || "",
    radiators: initialData.radiators || "",
    coreWeight: initialData.coreWeight || "",
    totalWeight: initialData.totalWeight || "",
    oilTemp: initialData.oilTemp || "",
    windingTemp: initialData.windingTemp || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>TRANSFORMER SPECIFICATIONS</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Make:</label>
          <input
            type="text"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Sr. No.:</label>
          <input
            type="text"
            value={formData.srNo}
            onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>MVA Rating:</label>
          <input
            type="text"
            value={formData.mvaRating}
            onChange={(e) => setFormData({ ...formData, mvaRating: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>HV (kV):</label>
          <input
            type="text"
            value={formData.hvKv}
            onChange={(e) => setFormData({ ...formData, hvKv: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>LV (kV):</label>
          <input
            type="text"
            value={formData.lvKv}
            onChange={(e) => setFormData({ ...formData, lvKv: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Impedance (%):</label>
          <input
            type="text"
            value={formData.impedance}
            onChange={(e) => setFormData({ ...formData, impedance: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Year of Mfg:</label>
          <input
            type="text"
            value={formData.yearOfMfg}
            onChange={(e) => setFormData({ ...formData, yearOfMfg: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Quantity (Ltrs):</label>
          <input
            type="text"
            value={formData.oilQuantity}
            onChange={(e) => setFormData({ ...formData, oilQuantity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Transporting Weight (Kg):</label>
          <input
            type="text"
            value={formData.transportingWeight}
            onChange={(e) => setFormData({ ...formData, transportingWeight: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>No. of Radiators:</label>
          <input
            type="text"
            value={formData.radiators}
            onChange={(e) => setFormData({ ...formData, radiators: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Core Weight (Kg):</label>
          <input
            type="text"
            value={formData.coreWeight}
            onChange={(e) => setFormData({ ...formData, coreWeight: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Weight (Kg):</label>
          <input
            type="text"
            value={formData.totalWeight}
            onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temp Rise (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Winding Temp Rise (°C):</label>
          <input
            type="text"
            value={formData.windingTemp}
            onChange={(e) => setFormData({ ...formData, windingTemp: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function PreErectionChecklistForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    mainTankPosition: initialData.mainTankPosition || "",
    mainTankWheels: initialData.mainTankWheels || "",
    turretsAvailable: initialData.turretsAvailable || "",
    bushingsAvailable: initialData.bushingsAvailable || "",
    radiatorsAvailable: initialData.radiatorsAvailable || "",
    radiatorSupport: initialData.radiatorSupport || "",
    conservatorSupport: initialData.conservatorSupport || "",
    pipelineAvailable: initialData.pipelineAvailable || "",
    equalizingPipeline: initialData.equalizingPipeline || "",
    valvesAvailable: initialData.valvesAvailable || "",
    coolingFans: initialData.coolingFans || "",
    buchholzRelay: initialData.buchholzRelay || "",
    prvAvailable: initialData.prvAvailable || "",
    neutralEarthing: initialData.neutralEarthing || "",
    protectionCables: initialData.protectionCables || "",
    readymadeGasket: initialData.readymadeGasket || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const checklistItems = [
    { key: "mainTankPosition", label: "Main Tank Position" },
    { key: "mainTankWheels", label: "Main Tank Wheels" },
    { key: "turretsAvailable", label: "Turrets Available" },
    { key: "bushingsAvailable", label: "Bushings Available" },
    { key: "radiatorsAvailable", label: "Radiators Available" },
    { key: "radiatorSupport", label: "Radiator Support" },
    { key: "conservatorSupport", label: "Conservator Support" },
    { key: "pipelineAvailable", label: "Pipeline Available" },
    { key: "equalizingPipeline", label: "Equalizing Pipeline" },
    { key: "valvesAvailable", label: "Valves Available" },
    { key: "coolingFans", label: "Cooling Fans" },
    { key: "buchholzRelay", label: "Buchholz Relay" },
    { key: "prvAvailable", label: "PRV Available" },
    { key: "neutralEarthing", label: "Neutral Earthing" },
    { key: "protectionCables", label: "Protection Cables" },
    { key: "readymadeGasket", label: "Readymade Gasket" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>PRE-ERECTION CHECKLIST</h3>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Available (Yes/No)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {checklistItems.map((item) => (
            <tr key={item.key}>
              <td>{item.label}</td>
              <td>
                <select
                  value={formData[item.key]}
                  onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${item.key}Remarks`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${item.key}Remarks`]: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function TanDeltaTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    meterUsed: initialData.meterUsed || "",
    date: initialData.date || "",
    time: initialData.time || "",
    modelSrNo: initialData.modelSrNo || "",
    wti: initialData.wti || "",
    oti: initialData.oti || "",
    range: initialData.range || "",
    ambient: initialData.ambient || "",
    hvTanDelta: initialData.hvTanDelta || "",
    hvCapacitance: initialData.hvCapacitance || "",
    lvTanDelta: initialData.lvTanDelta || "",
    lvCapacitance: initialData.lvCapacitance || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>TAN DELTA TEST</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Meter Used:</label>
          <input
            type="text"
            value={formData.meterUsed}
            onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Model & S. No.:</label>
          <input
            type="text"
            value={formData.modelSrNo}
            onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>WTI:</label>
          <input
            type="text"
            value={formData.wti}
            onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>OTI:</label>
          <input
            type="text"
            value={formData.oti}
            onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Range:</label>
          <input
            type="text"
            value={formData.range}
            onChange={(e) => setFormData({ ...formData, range: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient:</label>
          <input
            type="text"
            value={formData.ambient}
            onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
            required
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Winding</th>
            <th>Tan Delta</th>
            <th>Capacitance (pF)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HV</td>
            <td>
              <input
                type="text"
                value={formData.hvTanDelta}
                onChange={(e) => setFormData({ ...formData, hvTanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvCapacitance}
                onChange={(e) => setFormData({ ...formData, hvCapacitance: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>LV</td>
            <td>
              <input
                type="text"
                value={formData.lvTanDelta}
                onChange={(e) => setFormData({ ...formData, lvTanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvCapacitance}
                onChange={(e) => setFormData({ ...formData, lvCapacitance: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 1
        </button>
      </div>
    </form>
  )
}

// Stage 2 Form Components
function TestValuesPriorFilterationForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    ambientTemp: initialData.ambientTemp || "",
    oilTemp: initialData.oilTemp || "",
    bdv1: initialData.bdv1 || "",
    bdv2: initialData.bdv2 || "",
    bdv3: initialData.bdv3 || "",
    bdv4: initialData.bdv4 || "",
    bdv5: initialData.bdv5 || "",
    bdv6: initialData.bdv6 || "",
    moistureContent: initialData.moistureContent || "",
    acidity: initialData.acidity || "",
    interfacialTension: initialData.interfacialTension || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>TEST VALUES PRIOR TO FILTERATION AND OIL FILLING</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient Temperature (°C):</label>
          <input
            type="text"
            value={formData.ambientTemp}
            onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temperature (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
      </div>

      <h4>BDV Test Results (kV)</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>BDV 1:</label>
          <input
            type="text"
            value={formData.bdv1}
            onChange={(e) => setFormData({ ...formData, bdv1: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 2:</label>
          <input
            type="text"
            value={formData.bdv2}
            onChange={(e) => setFormData({ ...formData, bdv2: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 3:</label>
          <input
            type="text"
            value={formData.bdv3}
            onChange={(e) => setFormData({ ...formData, bdv3: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 4:</label>
          <input
            type="text"
            value={formData.bdv4}
            onChange={(e) => setFormData({ ...formData, bdv4: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 5:</label>
          <input
            type="text"
            value={formData.bdv5}
            onChange={(e) => setFormData({ ...formData, bdv5: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 6:</label>
          <input
            type="text"
            value={formData.bdv6}
            onChange={(e) => setFormData({ ...formData, bdv6: e.target.value })}
            required
          />
        </div>
      </div>

      <h4>Additional Tests</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Moisture Content (ppm):</label>
          <input
            type="text"
            value={formData.moistureContent}
            onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Acidity (mg KOH/g):</label>
          <input
            type="text"
            value={formData.acidity}
            onChange={(e) => setFormData({ ...formData, acidity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Interfacial Tension (mN/m):</label>
          <input
            type="text"
            value={formData.interfacialTension}
            onChange={(e) => setFormData({ ...formData, interfacialTension: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 2
        </button>
      </div>
    </form>
  )
}

// Stage 3 Form Components
function IRAfterErectionForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    ambientTemp: initialData.ambientTemp || "",
    oilTemp: initialData.oilTemp || "",
    relativeHumidity: initialData.relativeHumidity || "",
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    lvEarth10Sec: initialData.lvEarth10Sec || "",
    lvEarth60Sec: initialData.lvEarth60Sec || "",
    lvEarth600Sec: initialData.lvEarth600Sec || "",
    hvLv10Sec: initialData.hvLv10Sec || "",
    hvLv60Sec: initialData.hvLv60Sec || "",
    hvLv600Sec: initialData.hvLv600Sec || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>IR AFTER ERECTION</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient Temperature (°C):</label>
          <input
            type="text"
            value={formData.ambientTemp}
            onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temperature (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Relative Humidity (%):</label>
          <input
            type="text"
            value={formData.relativeHumidity}
            onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
            required
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HV - Earth</td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>LV - Earth</td>
            <td>
              <input
                type="text"
                value={formData.lvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>HV - LV</td>
            <td>
              <input
                type="text"
                value={formData.hvLv10Sec}
                onChange={(e) => setFormData({ ...formData, hvLv10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv60Sec}
                onChange={(e) => setFormData({ ...formData, hvLv60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv600Sec}
                onChange={(e) => setFormData({ ...formData, hvLv600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function OilTestingRecordForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    ambientTemp: initialData.ambientTemp || "",
    oilTemp: initialData.oilTemp || "",
    bdv1: initialData.bdv1 || "",
    bdv2: initialData.bdv2 || "",
    bdv3: initialData.bdv3 || "",
    bdv4: initialData.bdv4 || "",
    bdv5: initialData.bdv5 || "",
    bdv6: initialData.bdv6 || "",
    moistureContent: initialData.moistureContent || "",
    acidity: initialData.acidity || "",
    interfacialTension: initialData.interfacialTension || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>RECORD OF OIL TESTING PRIOR TO FILLING IN MAIN TANK</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient Temperature (°C):</label>
          <input
            type="text"
            value={formData.ambientTemp}
            onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temperature (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
      </div>

      <h4>BDV Test Results (kV)</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>BDV 1:</label>
          <input
            type="text"
            value={formData.bdv1}
            onChange={(e) => setFormData({ ...formData, bdv1: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 2:</label>
          <input
            type="text"
            value={formData.bdv2}
            onChange={(e) => setFormData({ ...formData, bdv2: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 3:</label>
          <input
            type="text"
            value={formData.bdv3}
            onChange={(e) => setFormData({ ...formData, bdv3: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 4:</label>
          <input
            type="text"
            value={formData.bdv4}
            onChange={(e) => setFormData({ ...formData, bdv4: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 5:</label>
          <input
            type="text"
            value={formData.bdv5}
            onChange={(e) => setFormData({ ...formData, bdv5: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>BDV 6:</label>
          <input
            type="text"
            value={formData.bdv6}
            onChange={(e) => setFormData({ ...formData, bdv6: e.target.value })}
            required
          />
        </div>
      </div>

      <h4>Additional Tests</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Moisture Content (ppm):</label>
          <input
            type="text"
            value={formData.moistureContent}
            onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Acidity (mg KOH/g):</label>
          <input
            type="text"
            value={formData.acidity}
            onChange={(e) => setFormData({ ...formData, acidity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Interfacial Tension (mN/m):</label>
          <input
            type="text"
            value={formData.interfacialTension}
            onChange={(e) => setFormData({ ...formData, interfacialTension: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function IRAfterOilToppingForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    ambientTemp: initialData.ambientTemp || "",
    oilTemp: initialData.oilTemp || "",
    relativeHumidity: initialData.relativeHumidity || "",
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    lvEarth10Sec: initialData.lvEarth10Sec || "",
    lvEarth60Sec: initialData.lvEarth60Sec || "",
    lvEarth600Sec: initialData.lvEarth600Sec || "",
    hvLv10Sec: initialData.hvLv10Sec || "",
    hvLv60Sec: initialData.hvLv60Sec || "",
    hvLv600Sec: initialData.hvLv600Sec || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>IR AFTER OIL TOPING UP TO CONSERVATOR</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient Temperature (°C):</label>
          <input
            type="text"
            value={formData.ambientTemp}
            onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temperature (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Relative Humidity (%):</label>
          <input
            type="text"
            value={formData.relativeHumidity}
            onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
            required
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HV - Earth</td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>LV - Earth</td>
            <td>
              <input
                type="text"
                value={formData.lvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>HV - LV</td>
            <td>
              <input
                type="text"
                value={formData.hvLv10Sec}
                onChange={(e) => setFormData({ ...formData, hvLv10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv60Sec}
                onChange={(e) => setFormData({ ...formData, hvLv60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv600Sec}
                onChange={(e) => setFormData({ ...formData, hvLv600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function PressureTestReportForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    ambientTemp: initialData.ambientTemp || "",
    oilTemp: initialData.oilTemp || "",
    testPressure: initialData.testPressure || "",
    duration: initialData.duration || "",
    result: initialData.result || "",
    remarks: initialData.remarks || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>PRESSURE TEST REPORT</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient Temperature (°C):</label>
          <input
            type="text"
            value={formData.ambientTemp}
            onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temperature (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Test Pressure (kPa):</label>
          <input
            type="text"
            value={formData.testPressure}
            onChange={(e) => setFormData({ ...formData, testPressure: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (hours):</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Result:</label>
          <select
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            required
          >
            <option value="">Select</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
        <div className="form-group">
          <label>Remarks:</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows="3"
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function OilFiltrationMainTankForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    startTime: initialData.startTime || "",
    endTime: initialData.endTime || "",
    oilQuantity: initialData.oilQuantity || "",
    filtrationRate: initialData.filtrationRate || "",
    initialBDV: initialData.initialBDV || "",
    finalBDV: initialData.finalBDV || "",
    initialMoisture: initialData.initialMoisture || "",
    finalMoisture: initialData.finalMoisture || "",
    remarks: initialData.remarks || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>RECORD FOR OIL FILTRATION - MAIN TANK</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Quantity (Ltrs):</label>
          <input
            type="text"
            value={formData.oilQuantity}
            onChange={(e) => setFormData({ ...formData, oilQuantity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Filtration Rate (Ltrs/hr):</label>
          <input
            type="text"
            value={formData.filtrationRate}
            onChange={(e) => setFormData({ ...formData, filtrationRate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Initial BDV (kV):</label>
          <input
            type="text"
            value={formData.initialBDV}
            onChange={(e) => setFormData({ ...formData, initialBDV: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Final BDV (kV):</label>
          <input
            type="text"
            value={formData.finalBDV}
            onChange={(e) => setFormData({ ...formData, finalBDV: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Initial Moisture (ppm):</label>
          <input
            type="text"
            value={formData.initialMoisture}
            onChange={(e) => setFormData({ ...formData, initialMoisture: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Final Moisture (ppm):</label>
          <input
            type="text"
            value={formData.finalMoisture}
            onChange={(e) => setFormData({ ...formData, finalMoisture: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Remarks:</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows="3"
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function OilFiltrationRadiatorForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    startTime: initialData.startTime || "",
    endTime: initialData.endTime || "",
    oilQuantity: initialData.oilQuantity || "",
    filtrationRate: initialData.filtrationRate || "",
    initialBDV: initialData.initialBDV || "",
    finalBDV: initialData.finalBDV || "",
    initialMoisture: initialData.initialMoisture || "",
    finalMoisture: initialData.finalMoisture || "",
    remarks: initialData.remarks || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>RECORD FOR OIL FILTRATION - RADIATOR AND COMBINE</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Quantity (Ltrs):</label>
          <input
            type="text"
            value={formData.oilQuantity}
            onChange={(e) => setFormData({ ...formData, oilQuantity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Filtration Rate (Ltrs/hr):</label>
          <input
            type="text"
            value={formData.filtrationRate}
            onChange={(e) => setFormData({ ...formData, filtrationRate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Initial BDV (kV):</label>
          <input
            type="text"
            value={formData.initialBDV}
            onChange={(e) => setFormData({ ...formData, initialBDV: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Final BDV (kV):</label>
          <input
            type="text"
            value={formData.finalBDV}
            onChange={(e) => setFormData({ ...formData, finalBDV: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Initial Moisture (ppm):</label>
          <input
            type="text"
            value={formData.initialMoisture}
            onChange={(e) => setFormData({ ...formData, initialMoisture: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Final Moisture (ppm):</label>
          <input
            type="text"
            value={formData.finalMoisture}
            onChange={(e) => setFormData({ ...formData, finalMoisture: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Remarks:</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows="3"
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function IRValueCirculationForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    ambientTemp: initialData.ambientTemp || "",
    oilTemp: initialData.oilTemp || "",
    relativeHumidity: initialData.relativeHumidity || "",
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    lvEarth10Sec: initialData.lvEarth10Sec || "",
    lvEarth60Sec: initialData.lvEarth60Sec || "",
    lvEarth600Sec: initialData.lvEarth600Sec || "",
    hvLv10Sec: initialData.hvLv10Sec || "",
    hvLv60Sec: initialData.hvLv60Sec || "",
    hvLv600Sec: initialData.hvLv600Sec || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>IR VALUE DURING CIRCULATION</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Ambient Temperature (°C):</label>
          <input
            type="text"
            value={formData.ambientTemp}
            onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Oil Temperature (°C):</label>
          <input
            type="text"
            value={formData.oilTemp}
            onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Relative Humidity (%):</label>
          <input
            type="text"
            value={formData.relativeHumidity}
            onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
            required
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HV - Earth</td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>LV - Earth</td>
            <td>
              <input
                type="text"
                value={formData.lvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, lvEarth600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>HV - LV</td>
            <td>
              <input
                type="text"
                value={formData.hvLv10Sec}
                onChange={(e) => setFormData({ ...formData, hvLv10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv60Sec}
                onChange={(e) => setFormData({ ...formData, hvLv60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv600Sec}
                onChange={(e) => setFormData({ ...formData, hvLv600Sec: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 3
        </button>
      </div>
    </form>
  )
}

// Stage 4 Form Components
function SFRATestRecordForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    makeOfMeter: initialData.makeOfMeter || "",
    date: initialData.date || "",
    modelSrNo: initialData.modelSrNo || "",
    ambient: initialData.ambient || "",
    oti: initialData.oti || "",
    wti: initialData.wti || "",
    testReportReviewed: initialData.testReportReviewed || "",
    acceptanceOfTest: initialData.acceptanceOfTest || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>SFRA TEST RECORD</h3>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>MAKE OF METER</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.makeOfMeter}
                onChange={(e) => setFormData({ ...formData, makeOfMeter: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>DATE</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MODEL & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.modelSrNo}
                onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>AMBIENT:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>OTI</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
                placeholder="°C"
                required
              />
            </td>
            <td>
              <strong>WTI</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
                placeholder="°C"
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Test report reviewed by</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.testReportReviewed}
                onChange={(e) => setFormData({ ...formData, testReportReviewed: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Acceptance of the test</strong>
            </td>
            <td>
              <select
                value={formData.acceptanceOfTest}
                onChange={(e) => setFormData({ ...formData, acceptanceOfTest: e.target.value })}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function IRValuesMeasurementForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    insulationTesterDetails: initialData.insulationTesterDetails || "",
    ambientTemp: initialData.ambientTemp || "",
    make: initialData.make || "",
    otiTemp: initialData.otiTemp || "",
    srNo: initialData.srNo || "",
    wtiTemp: initialData.wtiTemp || "",
    range: initialData.range || "",
    relativeHumidity: initialData.relativeHumidity || "",
    voltageLevel: initialData.voltageLevel || "",
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    ratioIR60_10: initialData.ratioIR60_10 || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>RECORD OF MEASUREMENT OF IR VALUES</h3>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>Date:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Time:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Details of Insulation tester</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.insulationTesterDetails}
                onChange={(e) => setFormData({ ...formData, insulationTesterDetails: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambientTemp}
                onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Make:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                required
              />
            </td>
            <td rowSpan="4"></td>
            <td rowSpan="4"></td>
          </tr>
          <tr>
            <td>
              <strong>OTI. Temp.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.otiTemp}
                onChange={(e) => setFormData({ ...formData, otiTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Sr. No.:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>WTI Temp.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wtiTemp}
                onChange={(e) => setFormData({ ...formData, wtiTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Range:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Voltage Level:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageLevel}
                onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>10 Sec</th>
            <th>60 Sec</th>
            <th>Ratio of IR 60/10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60_10}
                onChange={(e) => setFormData({ ...formData, ratioIR60_10: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function TanDeltaCapacitanceTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Bushing Test
    bushingMeterUsed: initialData.bushingMeterUsed || "",
    bushingDate: initialData.bushingDate || "",
    bushingTime: initialData.bushingTime || "",
    bushingModelSrNo: initialData.bushingModelSrNo || "",
    bushingWti: initialData.bushingWti || "",
    bushingOti: initialData.bushingOti || "",
    bushing05kv11TanDelta: initialData.bushing05kv11TanDelta || "",
    bushing05kv11Capacitance: initialData.bushing05kv11Capacitance || "",
    bushing05kv11ExcitationCurrent: initialData.bushing05kv11ExcitationCurrent || "",
    bushing05kv11DielectricLoss: initialData.bushing05kv11DielectricLoss || "",
    bushing05kv2TanDelta: initialData.bushing05kv2TanDelta || "",
    bushing05kv2Capacitance: initialData.bushing05kv2Capacitance || "",
    bushing05kv2ExcitationCurrent: initialData.bushing05kv2ExcitationCurrent || "",
    bushing05kv2DielectricLoss: initialData.bushing05kv2DielectricLoss || "",
    bushing10kv11TanDelta: initialData.bushing10kv11TanDelta || "",
    bushing10kv11Capacitance: initialData.bushing10kv11Capacitance || "",
    bushing10kv11ExcitationCurrent: initialData.bushing10kv11ExcitationCurrent || "",
    bushing10kv11DielectricLoss: initialData.bushing10kv11DielectricLoss || "",
    bushing10kv2TanDelta: initialData.bushing10kv2TanDelta || "",
    bushing10kv2Capacitance: initialData.bushing10kv2Capacitance || "",
    bushing10kv2ExcitationCurrent: initialData.bushing10kv2ExcitationCurrent || "",
    bushing10kv2DielectricLoss: initialData.bushing10kv2DielectricLoss || "",
    // Winding Test
    windingMeterUsed: initialData.windingMeterUsed || "",
    windingDate: initialData.windingDate || "",
    windingTime: initialData.windingTime || "",
    windingMakeSrNo: initialData.windingMakeSrNo || "",
    windingAmbientTemp: initialData.windingAmbientTemp || "",
    windingOilTemp: initialData.windingOilTemp || "",
    winding05kvHvGTanDelta: initialData.winding05kvHvGTanDelta || "",
    winding05kvHvGCapacitance: initialData.winding05kvHvGCapacitance || "",
    winding05kvHvGExcitationCurrent: initialData.winding05kvHvGExcitationCurrent || "",
    winding05kvHvGDielectricLoss: initialData.winding05kvHvGDielectricLoss || "",
    winding10kvHvGTanDelta: initialData.winding10kvHvGTanDelta || "",
    winding10kvHvGCapacitance: initialData.winding10kvHvGCapacitance || "",
    winding10kvHvGExcitationCurrent: initialData.winding10kvHvGExcitationCurrent || "",
    winding10kvHvGDielectricLoss: initialData.winding10kvHvGDielectricLoss || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>TAN DELTA AND CAPACITANCE TEST ON BUSHING AND WINDING</h3>
      </div>

      <h4>Tan delta and capacitance test on bushing</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingMeterUsed}
                onChange={(e) => setFormData({ ...formData, bushingMeterUsed: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.bushingDate}
                onChange={(e) => setFormData({ ...formData, bushingDate: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.bushingTime}
                onChange={(e) => setFormData({ ...formData, bushingTime: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MODEL & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingModelSrNo}
                onChange={(e) => setFormData({ ...formData, bushingModelSrNo: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>WTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingWti}
                onChange={(e) => setFormData({ ...formData, bushingWti: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>OTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingOti}
                onChange={(e) => setFormData({ ...formData, bushingOti: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th rowSpan="2">AT 05 KV PHASE</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv11TanDelta}
                onChange={(e) => setFormData({ ...formData, bushing05kv11TanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv11Capacitance}
                onChange={(e) => setFormData({ ...formData, bushing05kv11Capacitance: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv11ExcitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing05kv11ExcitationCurrent: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv11DielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing05kv11DielectricLoss: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv2TanDelta}
                onChange={(e) => setFormData({ ...formData, bushing05kv2TanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv2Capacitance}
                onChange={(e) => setFormData({ ...formData, bushing05kv2Capacitance: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv2ExcitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing05kv2ExcitationCurrent: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing05kv2DielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing05kv2DielectricLoss: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th rowSpan="2">AT 10 KV PHASE</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv11TanDelta}
                onChange={(e) => setFormData({ ...formData, bushing10kv11TanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv11Capacitance}
                onChange={(e) => setFormData({ ...formData, bushing10kv11Capacitance: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv11ExcitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing10kv11ExcitationCurrent: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv11DielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing10kv11DielectricLoss: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv2TanDelta}
                onChange={(e) => setFormData({ ...formData, bushing10kv2TanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv2Capacitance}
                onChange={(e) => setFormData({ ...formData, bushing10kv2Capacitance: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv2ExcitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing10kv2ExcitationCurrent: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing10kv2DielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing10kv2DielectricLoss: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "30px" }}>Tan delta and capacitance test on winding</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingMeterUsed}
                onChange={(e) => setFormData({ ...formData, windingMeterUsed: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.windingDate}
                onChange={(e) => setFormData({ ...formData, windingDate: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.windingTime}
                onChange={(e) => setFormData({ ...formData, windingTime: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MAKE & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingMakeSrNo}
                onChange={(e) => setFormData({ ...formData, windingMakeSrNo: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>AMB IENT TEMP</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingAmbientTemp}
                onChange={(e) => setFormData({ ...formData, windingAmbientTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>OIL TEMP</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingOilTemp}
                onChange={(e) => setFormData({ ...formData, windingOilTemp: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>AT 05 KV IN BETWEEN</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV – G</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding05kvHvGTanDelta}
                onChange={(e) => setFormData({ ...formData, winding05kvHvGTanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding05kvHvGCapacitance}
                onChange={(e) => setFormData({ ...formData, winding05kvHvGCapacitance: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding05kvHvGExcitationCurrent}
                onChange={(e) => setFormData({ ...formData, winding05kvHvGExcitationCurrent: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding05kvHvGDielectricLoss}
                onChange={(e) => setFormData({ ...formData, winding05kvHvGDielectricLoss: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>AT 10 KV IN BETWEEN</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV – G</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding10kvHvGTanDelta}
                onChange={(e) => setFormData({ ...formData, winding10kvHvGTanDelta: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding10kvHvGCapacitance}
                onChange={(e) => setFormData({ ...formData, winding10kvHvGCapacitance: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding10kvHvGExcitationCurrent}
                onChange={(e) => setFormData({ ...formData, winding10kvHvGExcitationCurrent: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding10kvHvGDielectricLoss}
                onChange={(e) => setFormData({ ...formData, winding10kvHvGDielectricLoss: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function VoltageRatioMagnetisingTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Voltage Ratio Test
    voltageRatio11_2Applied: initialData.voltageRatio11_2Applied || "",
    voltageRatio11_21Measured: initialData.voltageRatio11_21Measured || "",
    voltageRatio2_21Measured: initialData.voltageRatio2_21Measured || "",
    voltageRatio11_21Applied: initialData.voltageRatio11_21Applied || "",
    voltageRatio11_2Measured: initialData.voltageRatio11_2Measured || "",
    voltageRatio2_21Measured2: initialData.voltageRatio2_21Measured2 || "",
    voltageRatio21_2Applied: initialData.voltageRatio21_2Applied || "",
    voltageRatio11_2Measured2: initialData.voltageRatio11_2Measured2 || "",
    voltageRatio11_21Measured2: initialData.voltageRatio11_21Measured2 || "",
    // Magnetising Current Test
    magnetisingAppliedVoltage: initialData.magnetisingAppliedVoltage || "",
    magnetisingDate: initialData.magnetisingDate || "",
    magnetisingTime: initialData.magnetisingTime || "",
    magnetisingMeterMakeSrNo: initialData.magnetisingMeterMakeSrNo || "",
    magnetising11_2Current: initialData.magnetising11_2Current || "",
    magnetising11_21Current: initialData.magnetising11_21Current || "",
    magnetising21_2Current: initialData.magnetising21_2Current || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>VOLTAGE RATIO TEST AND MAGNETISING CURRENT TEST</h3>
      </div>

      <h4>TYPE OF TEST – VOLTAGE RATIO TEST</h4>
      <table className="form-table">
        <thead>
          <tr>
            <th>Applied Voltage</th>
            <th colSpan="2">Measured Voltage</th>
          </tr>
          <tr>
            <th></th>
            <th>1.1 – 2.1</th>
            <th>2 – 2.1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1 – 2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageRatio11_21Measured}
                onChange={(e) => setFormData({ ...formData, voltageRatio11_21Measured: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageRatio2_21Measured}
                onChange={(e) => setFormData({ ...formData, voltageRatio2_21Measured: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.1 – 2.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageRatio11_2Measured}
                onChange={(e) => setFormData({ ...formData, voltageRatio11_2Measured: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageRatio2_21Measured2}
                onChange={(e) => setFormData({ ...formData, voltageRatio2_21Measured2: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>2.1 – 2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageRatio11_2Measured2}
                onChange={(e) => setFormData({ ...formData, voltageRatio11_2Measured2: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageRatio11_21Measured2}
                onChange={(e) => setFormData({ ...formData, voltageRatio11_21Measured2: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "30px" }}>TYPE OF TEST – MAGNETISING CURRENT TEST</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.magnetisingAppliedVoltage}
                onChange={(e) => setFormData({ ...formData, magnetisingAppliedVoltage: e.target.value })}
                placeholder="VOLTS"
                required
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.magnetisingDate}
                onChange={(e) => setFormData({ ...formData, magnetisingDate: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.magnetisingTime}
                onChange={(e) => setFormData({ ...formData, magnetisingTime: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.magnetisingMeterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, magnetisingMeterMakeSrNo: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Applied Voltage</th>
            <th colSpan="3">Measured Current</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1 – 2</strong>
            </td>
            <td>
              <strong>1.1</strong>
              <input
                type="text"
                value={formData.magnetising11_2Current}
                onChange={(e) => setFormData({ ...formData, magnetising11_2Current: e.target.value })}
                required
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>1.1 – 2.1</strong>
            </td>
            <td>
              <strong>1.1 – 2.1</strong>
              <input
                type="text"
                value={formData.magnetising11_21Current}
                onChange={(e) => setFormData({ ...formData, magnetising11_21Current: e.target.value })}
                required
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>2.1 – 2</strong>
            </td>
            <td>
              <strong>2.1 – 2</strong>
              <input
                type="text"
                value={formData.magnetising21_2Current}
                onChange={(e) => setFormData({ ...formData, magnetising21_2Current: e.target.value })}
                required
              />
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function ShortCircuitTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    appliedVoltage: initialData.appliedVoltage || "",
    date: initialData.date || "",
    time: initialData.time || "",
    meterMakeSrNo: initialData.meterMakeSrNo || "",
    // Applied Voltage and Measured Current table
    appliedVoltage11_2: initialData.appliedVoltage11_2 || "",
    measuredCurrent11: initialData.measuredCurrent11 || "",
    measuredCurrent2_21Shorted: initialData.measuredCurrent2_21Shorted || "",
    appliedVoltage2_21: initialData.appliedVoltage2_21 || "",
    measuredCurrent2: initialData.measuredCurrent2 || "",
    measuredCurrent11_21Shorted: initialData.measuredCurrent11_21Shorted || "",
    // Impedance calculation
    impedancePercentage: initialData.impedancePercentage || "",
    appliedVoltageHV: initialData.appliedVoltageHV || "",
    ratedCurrentLV: initialData.ratedCurrentLV || "",
    ratedVoltageHV: initialData.ratedVoltageHV || "",
    measuredCurrentLV: initialData.measuredCurrentLV || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>TYPE OF TEST – SHORT CIRCUIT TEST</h3>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.appliedVoltage}
                onChange={(e) => setFormData({ ...formData, appliedVoltage: e.target.value })}
                placeholder="VOLTS"
                required
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>APPLIED VOLTAGE</th>
            <th>Measured Current</th>
            <th>Measured Current</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1 – 2</strong>
            </td>
            <td>
              <strong>1.1</strong>
              <input
                type="text"
                value={formData.measuredCurrent11}
                onChange={(e) => setFormData({ ...formData, measuredCurrent11: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>2 – 2.1 SHORTED</strong>
              <input
                type="text"
                value={formData.measuredCurrent2_21Shorted}
                onChange={(e) => setFormData({ ...formData, measuredCurrent2_21Shorted: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>2 – 2.1</strong>
            </td>
            <td>
              <strong>2</strong>
              <input
                type="text"
                value={formData.measuredCurrent2}
                onChange={(e) => setFormData({ ...formData, measuredCurrent2: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>1.1 – 2.1 SHORTED</strong>
              <input
                type="text"
                value={formData.measuredCurrent11_21Shorted}
                onChange={(e) => setFormData({ ...formData, measuredCurrent11_21Shorted: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "30px", border: "2px solid #000", padding: "20px" }}>
        <h4>Impedance calculation</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>
              <strong>Applied Voltage HV</strong>
            </label>
            <input
              type="text"
              value={formData.appliedVoltageHV}
              onChange={(e) => setFormData({ ...formData, appliedVoltageHV: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <strong>Rated Current LV</strong>
            </label>
            <input
              type="text"
              value={formData.ratedCurrentLV}
              onChange={(e) => setFormData({ ...formData, ratedCurrentLV: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="impedance-formula" style={{ textAlign: "center", margin: "20px 0" }}>
          <strong>%Z = _________________ X _________________ X 100</strong>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>
              <strong>Rated voltage HV</strong>
            </label>
            <input
              type="text"
              value={formData.ratedVoltageHV}
              onChange={(e) => setFormData({ ...formData, ratedVoltageHV: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <strong>Measured current LV</strong>
            </label>
            <input
              type="text"
              value={formData.measuredCurrentLV}
              onChange={(e) => setFormData({ ...formData, measuredCurrentLV: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: "20px" }}>
          <label>
            <strong>Impedance %Z =</strong>
          </label>
          <input
            type="text"
            value={formData.impedancePercentage}
            onChange={(e) => setFormData({ ...formData, impedancePercentage: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function WindingResistanceIRPITestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Winding Resistance Test
    windingMeterUsed: initialData.windingMeterUsed || "",
    windingDate: initialData.windingDate || "",
    windingTime: initialData.windingTime || "",
    windingMeterMakeSrNo: initialData.windingMeterMakeSrNo || "",
    windingWti: initialData.windingWti || "",
    windingOti: initialData.windingOti || "",
    windingRange: initialData.windingRange || "",
    windingAmbient: initialData.windingAmbient || "",
    winding11_2Resistance: initialData.winding11_2Resistance || "",
    winding11_21Resistance: initialData.winding11_21Resistance || "",
    winding21_2Resistance: initialData.winding21_2Resistance || "",
    // IR & PI Values Test
    irDate: initialData.irDate || "",
    irTime: initialData.irTime || "",
    irInsulationTesterDetails: initialData.irInsulationTesterDetails || "",
    irAmbTemp: initialData.irAmbTemp || "",
    irMake: initialData.irMake || "",
    irOtiTemp: initialData.irOtiTemp || "",
    irSrNo: initialData.irSrNo || "",
    irWtiTemp: initialData.irWtiTemp || "",
    irRange: initialData.irRange || "",
    irRelativeHumidity: initialData.irRelativeHumidity || "",
    irVoltageLevel: initialData.irVoltageLevel || "",
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    ratioIR60: initialData.ratioIR60 || "",
    ratioIR600_60: initialData.ratioIR600_60 || "",
    ir10: initialData.ir10 || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>WINDING RESISTANCE TEST AND RECORD OF MEASUREMENT OF IR & PI VALUES</h3>
      </div>

      <h4>TYPE OF TEST – WINDING RESISTANCE TEST</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingMeterUsed}
                onChange={(e) => setFormData({ ...formData, windingMeterUsed: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.windingDate}
                onChange={(e) => setFormData({ ...formData, windingDate: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.windingTime}
                onChange={(e) => setFormData({ ...formData, windingTime: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingMeterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, windingMeterMakeSrNo: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>WTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingWti}
                onChange={(e) => setFormData({ ...formData, windingWti: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>OTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingOti}
                onChange={(e) => setFormData({ ...formData, windingOti: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>RANGE</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingRange}
                onChange={(e) => setFormData({ ...formData, windingRange: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>AMBIENT:</strong>
            </td>
            <td colSpan="2">
              <input
                type="text"
                value={formData.windingAmbient}
                onChange={(e) => setFormData({ ...formData, windingAmbient: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h5 style={{ marginTop: "20px" }}>ALL MEASUREMENT IN OHMS / MILI OHMS</h5>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>1.1 – 2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding11_2Resistance}
                onChange={(e) => setFormData({ ...formData, winding11_2Resistance: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.1 – 2.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding11_21Resistance}
                onChange={(e) => setFormData({ ...formData, winding11_21Resistance: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>2.1 – 2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding21_2Resistance}
                onChange={(e) => setFormData({ ...formData, winding21_2Resistance: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>RECORD OF MEASUREMENT OF IR & PI VALUES</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>Date:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.irDate}
                onChange={(e) => setFormData({ ...formData, irDate: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Time:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.irTime}
                onChange={(e) => setFormData({ ...formData, irTime: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Details of Insulation tester</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irInsulationTesterDetails}
                onChange={(e) => setFormData({ ...formData, irInsulationTesterDetails: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irAmbTemp}
                onChange={(e) => setFormData({ ...formData, irAmbTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Make:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irMake}
                onChange={(e) => setFormData({ ...formData, irMake: e.target.value })}
                required
              />
            </td>
            <td rowSpan="4"></td>
            <td rowSpan="4"></td>
          </tr>
          <tr>
            <td>
              <strong>OTI Temp:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irOtiTemp}
                onChange={(e) => setFormData({ ...formData, irOtiTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Sr. No.:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irSrNo}
                onChange={(e) => setFormData({ ...formData, irSrNo: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Wdg. Temp.:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irWtiTemp}
                onChange={(e) => setFormData({ ...formData, irWtiTemp: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Range:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irRange}
                onChange={(e) => setFormData({ ...formData, irRange: e.target.value })}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irRelativeHumidity}
                onChange={(e) => setFormData({ ...formData, irRelativeHumidity: e.target.value })}
                required
              />
            </td>
            <td>
              <strong>Voltage Level:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.irVoltageLevel}
                onChange={(e) => setFormData({ ...formData, irVoltageLevel: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>10 Sec</th>
            <th>60 Sec</th>
            <th>600 Sec</th>
            <th>Ratio of IR 60</th>
            <th>Ratio of IR 600/ 60</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>IR 10</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60}
                onChange={(e) => setFormData({ ...formData, ratioIR60: e.target.value })}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR600_60}
                onChange={(e) => setFormData({ ...formData, ratioIR600_60: e.target.value })}
                required
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 4
        </button>
      </div>
    </form>
  )
}

// Stage 5 Form Components
function PreChargingChecklistForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Pre-Charging Check List
    oilLevel: initialData.oilLevel || "",
    oilLevelRemarks: initialData.oilLevelRemarks || "",
    oilLeakage: initialData.oilLeakage || "",
    oilLeakageRemarks: initialData.oilLeakageRemarks || "",
    bushingCleaning: initialData.bushingCleaning || "",
    bushingCleaningRemarks: initialData.bushingCleaningRemarks || "",
    earthingConnection: initialData.earthingConnection || "",
    earthingConnectionRemarks: initialData.earthingConnectionRemarks || "",
    protectionSetting: initialData.protectionSetting || "",
    protectionSettingRemarks: initialData.protectionSettingRemarks || "",
    coolingSystem: initialData.coolingSystem || "",
    coolingSystemRemarks: initialData.coolingSystemRemarks || "",
    tapChangerOperation: initialData.tapChangerOperation || "",
    tapChangerOperationRemarks: initialData.tapChangerOperationRemarks || "",
    buchholzRelay: initialData.buchholzRelay || "",
    buchholzRelayRemarks: initialData.buchholzRelayRemarks || "",
    wtiOtiGauges: initialData.wtiOtiGauges || "",
    wtiOtiGaugesRemarks: initialData.wtiOtiGaugesRemarks || "",
    oilSamplingValve: initialData.oilSamplingValve || "",
    oilSamplingValveRemarks: initialData.oilSamplingValveRemarks || "",
    // Continuation of Pre-Charging Check List
    magneticOilLevel: initialData.magneticOilLevel || "",
    magneticOilLevelRemarks: initialData.magneticOilLevelRemarks || "",
    oilFiltrationPlant: initialData.oilFiltrationPlant || "",
    oilFiltrationPlantRemarks: initialData.oilFiltrationPlantRemarks || "",
    nitrogenCylinder: initialData.nitrogenCylinder || "",
    nitrogenCylinderRemarks: initialData.nitrogenCylinderRemarks || "",
    vacuumPump: initialData.vacuumPump || "",
    vacuumPumpRemarks: initialData.vacuumPumpRemarks || "",
    testingEquipment: initialData.testingEquipment || "",
    testingEquipmentRemarks: initialData.testingEquipmentRemarks || "",
    safetyEquipment: initialData.safetyEquipment || "",
    safetyEquipmentRemarks: initialData.safetyEquipmentRemarks || "",
    workPermit: initialData.workPermit || "",
    workPermitRemarks: initialData.workPermitRemarks || "",
    qualifiedPersonnel: initialData.qualifiedPersonnel || "",
    qualifiedPersonnelRemarks: initialData.qualifiedPersonnelRemarks || "",
    emergencyProcedure: initialData.emergencyProcedure || "",
    emergencyProcedureRemarks: initialData.emergencyProcedureRemarks || "",
    communicationSystem: initialData.communicationSystem || "",
    communicationSystemRemarks: initialData.communicationSystemRemarks || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const checklistItems1 = [
    { key: "oilLevel", label: "Oil Level in Conservator" },
    { key: "oilLeakage", label: "Oil Leakage Check" },
    { key: "bushingCleaning", label: "Bushing Cleaning" },
    { key: "earthingConnection", label: "Earthing Connection" },
    { key: "protectionSetting", label: "Protection Setting" },
    { key: "coolingSystem", label: "Cooling System Check" },
    { key: "tapChangerOperation", label: "Tap Changer Operation" },
    { key: "buchholzRelay", label: "Buchholz Relay" },
    { key: "wtiOtiGauges", label: "WTI & OTI Gauges" },
    { key: "oilSamplingValve", label: "Oil Sampling Valve" },
  ]

  const checklistItems2 = [
    { key: "magneticOilLevel", label: "Magnetic Oil Level Gauge" },
    { key: "oilFiltrationPlant", label: "Oil Filtration Plant" },
    { key: "nitrogenCylinder", label: "Nitrogen Cylinder" },
    { key: "vacuumPump", label: "Vacuum Pump" },
    { key: "testingEquipment", label: "Testing Equipment" },
    { key: "safetyEquipment", label: "Safety Equipment" },
    { key: "workPermit", label: "Work Permit" },
    { key: "qualifiedPersonnel", label: "Qualified Personnel" },
    { key: "emergencyProcedure", label: "Emergency Procedure" },
    { key: "communicationSystem", label: "Communication System" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>PRE-CHARGING CHECK LIST</h3>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Check List</th>
            <th>Status (OK/NOT OK)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {checklistItems1.map((item, index) => (
            <tr key={item.key}>
              <td>{index + 1}</td>
              <td>{item.label}</td>
              <td>
                <select
                  value={formData[item.key]}
                  onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="OK">OK</option>
                  <option value="NOT OK">NOT OK</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${item.key}Remarks`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${item.key}Remarks`]: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>CONTINUATION OF PRE-CHARGING CHECK LIST</h4>
      <table className="form-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Check List</th>
            <th>Status (OK/NOT OK)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {checklistItems2.map((item, index) => (
            <tr key={item.key}>
              <td>{index + 11}</td>
              <td>{item.label}</td>
              <td>
                <select
                  value={formData[item.key]}
                  onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="OK">OK</option>
                  <option value="NOT OK">NOT OK</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${item.key}Remarks`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${item.key}Remarks`]: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && (
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 5
        </button>
      </div>
    </form>
  )
}

// Stage 6 Form Components
function WorkCompletionReportForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    projectName: initialData.projectName || "",
    location: initialData.location || "",
    contractorName: initialData.contractorName || "",
    workOrderNo: initialData.workOrderNo || "",
    workStartDate: initialData.workStartDate || "",
    workCompletionDate: initialData.workCompletionDate || "",
    transformerMake: initialData.transformerMake || "",
    transformerRating: initialData.transformerRating || "",
    transformerSerialNo: initialData.transformerSerialNo || "",
    transformerYearOfMfg: initialData.transformerYearOfMfg || "",
    workDescription: initialData.workDescription || "",
    testingCompleted: initialData.testingCompleted || "",
    testingCompletedRemarks: initialData.testingCompletedRemarks || "",
    commissioning: initialData.commissioning || "",
    commissioningRemarks: initialData.commissioningRemarks || "",
    documentationHandover: initialData.documentationHandover || "",
    documentationHandoverRemarks: initialData.documentationHandoverRemarks || "",
    trainingProvided: initialData.trainingProvided || "",
    trainingProvidedRemarks: initialData.trainingProvidedRemarks || "",
    warrantyDetails: initialData.warrantyDetails || "",
    warrantyDetailsRemarks: initialData.warrantyDetailsRemarks || "",
    customerSatisfaction: initialData.customerSatisfaction || "",
    customerSatisfactionRemarks: initialData.customerSatisfactionRemarks || "",
    finalRemarks: initialData.finalRemarks || "",
    projectManagerName: initialData.projectManagerName || "",
    customerRepresentativeName: initialData.customerRepresentativeName || "",
    vpesEngineerName: initialData.vpesEngineerName || "",
    customerRepName: initialData.customerRepName || "",
    signatureDate: initialData.signatureDate || "",
    projectManagerSignature: initialData.projectManagerSignature || "",
    customerRepresentativeSignature: initialData.customerRepresentativeSignature || "",
    vpesEngineerSignature: initialData.vpesEngineerSignature || "",
    customerRepSignature: initialData.customerRepSignature || "",
    ...initialData,
  })

  const {
    canvasRef: vpesCanvasRef,
    signatureDataUrl: vpesSignatureDataUrl,
    clearCanvas: clearVpesCanvas,
    startDrawing: startVpesDrawing,
    draw: drawVpes,
    stopDrawing: stopVpesDrawing,
  } = useSignatureCanvas(formData.vpesEngineerSignature)

  const {
    canvasRef: customerCanvasRef,
    signatureDataUrl: customerSignatureDataUrl,
    clearCanvas: clearCustomerCanvas,
    startDrawing: startCustomerDrawing,
    draw: drawCustomer,
    stopDrawing: stopCustomerDrawing,
  } = useSignatureCanvas(formData.customerRepSignature)

  const {
    canvasRef: projectManagerCanvasRef,
    signatureDataUrl: projectManagerSignatureDataUrl,
    clearCanvas: clearProjectManagerCanvas,
    startDrawing: startProjectManagerDrawing,
    draw: drawProjectManager,
    stopDrawing: stopProjectManagerDrawing,
  } = useSignatureCanvas(formData.projectManagerSignature)

  const {
    canvasRef: customerRepresentativeCanvasRef,
    signatureDataUrl: customerRepresentativeSignatureDataUrl,
    clearCanvas: clearCustomerRepresentativeCanvas,
    startDrawing: startCustomerRepresentativeDrawing,
    draw: drawCustomerRepresentative,
    stopDrawing: stopCustomerRepresentativeDrawing,
  } = useSignatureCanvas(formData.customerRepresentativeSignature)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, vpesEngineerSignature: vpesSignatureDataUrl }))
  }, [vpesSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepSignature: customerSignatureDataUrl }))
  }, [customerSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, projectManagerSignature: projectManagerSignatureDataUrl }))
  }, [projectManagerSignatureDataUrl])

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customerRepresentativeSignature: customerRepresentativeSignatureDataUrl }))
  }, [customerRepresentativeSignatureDataUrl])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const completionItems = [
    { key: "testingCompleted", label: "All Testing Completed as per Standards" },
    { key: "commissioning", label: "Commissioning Successfully Completed" },
    { key: "documentationHandover", label: "Documentation Handover Completed" },
    { key: "trainingProvided", label: "Training Provided to Customer Personnel" },
    { key: "warrantyDetails", label: "Warranty Details Explained" },
    { key: "customerSatisfaction", label: "Customer Satisfaction Achieved" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>WORK COMPLETION REPORT</h3>
      </div>

      <h4>Project Details</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Contractor Name:</label>
          <input
            type="text"
            value={formData.contractorName}
            onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Work Order No:</label>
          <input
            type="text"
            value={formData.workOrderNo}
            onChange={(e) => setFormData({ ...formData, workOrderNo: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Work Start Date:</label>
          <input
            type="date"
            value={formData.workStartDate}
            onChange={(e) => setFormData({ ...formData, workStartDate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Work Completion Date:</label>
          <input
            type="date"
            value={formData.workCompletionDate}
            onChange={(e) => setFormData({ ...formData, workCompletionDate: e.target.value })}
            required
          />
        </div>
      </div>

      <h4>Transformer Details</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Make:</label>
          <input
            type="text"
            value={formData.transformerMake}
            onChange={(e) => setFormData({ ...formData, transformerMake: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="text"
            value={formData.transformerRating}
            onChange={(e) => setFormData({ ...formData, transformerRating: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Serial No:</label>
          <input
            type="text"
            value={formData.transformerSerialNo}
            onChange={(e) => setFormData({ ...formData, transformerSerialNo: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Year of Manufacturing:</label>
          <input
            type="text"
            value={formData.transformerYearOfMfg}
            onChange={(e) => setFormData({ ...formData, transformerYearOfMfg: e.target.value })}
            required
          />
        </div>
      </div>

      <h4>Work Description</h4>
      <div className="form-group">
        <label>Description of Work Completed:</label>
        <textarea
          value={formData.workDescription}
          onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
          rows="4"
          required
        />
      </div>

      <h4>Completion Checklist</h4>
      <table className="form-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Completion Items</th>
            <th>Status (Yes/No)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {completionItems.map((item, index) => (
            <tr key={item.key}>
              <td>{index + 1}</td>
              <td>{item.label}</td>
              <td>
                <select
                  value={formData[item.key]}
                  onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${item.key}Remarks`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${item.key}Remarks`]: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Final Remarks</h4>
      <div className="form-group">
        <label>Final Remarks:</label>
        <textarea
          value={formData.finalRemarks}
          onChange={(e) => setFormData({ ...formData, finalRemarks: e.target.value })}
          rows="3"
        />
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>Project Manager</label>
          <input
            type="text"
            value={formData.projectManagerName}
            onChange={(e) => setFormData({ ...formData, projectManagerName: e.target.value })}
            placeholder="Name"
            required
          />
          <canvas
            ref={projectManagerCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startProjectManagerDrawing}
            onMouseMove={drawProjectManager}
            onMouseUp={stopProjectManagerDrawing}
            onMouseLeave={stopProjectManagerDrawing}
            onTouchStart={startProjectManagerDrawing}
            onTouchMove={drawProjectManager}
            onTouchEnd={stopProjectManagerDrawing}
          />
          <button type="button" onClick={clearProjectManagerCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        <div className="signature-box">
          <label>Customer Representative</label>
          <input
            type="text"
            value={formData.customerRepresentativeName}
            onChange={(e) => setFormData({ ...formData, customerRepresentativeName: e.target.value })}
            placeholder="Name"
            required
          />
          <canvas
            ref={customerRepresentativeCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startCustomerRepresentativeDrawing}
            onMouseMove={drawCustomerRepresentative}
            onMouseUp={stopCustomerRepresentativeDrawing}
            onMouseLeave={stopCustomerRepresentativeDrawing}
            onTouchStart={startCustomerRepresentativeDrawing}
            onTouchMove={drawCustomerRepresentative}
            onTouchEnd={stopCustomerRepresentativeDrawing}
          />
          <button type="button" onClick={clearCustomerRepresentativeCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
      </div>

      <div className="signature-section">
        <div className="signature-box">
          <label>VPES Engineer</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.vpesEngineerName || ""}
            onChange={(e) => setFormData({ ...formData, vpesEngineerName: e.target.value })}
          />
          <canvas
            ref={vpesCanvasRef}
            width={200}
            height={100}
            style={{ border: "1px solid #000", touchAction: "none" }}
            onMouseDown={startVpesDrawing}
            onMouseMove={drawVpes}
            onMouseUp={stopVpesDrawing}
            onMouseLeave={stopVpesDrawing}
            onTouchStart={startVpesDrawing}
            onTouchMove={drawVpes}
            onTouchEnd={stopVpesDrawing}
          />
          <button type="button" onClick={clearVpesCanvas} className="clear-signature-btn">
            Clear Signature
          </button>
          <small>Signature & Date</small>
        </div>
        {isLastFormOfStage && ( // This will always be true for WorkCompletionReportForm as it's the last form of Stage 6
          <div className="signature-box">
            <label>Customer Representative</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.customerRepName || ""}
              onChange={(e) => setFormData({ ...formData, customerRepName: e.target.value })}
            />
            <canvas
              ref={customerCanvasRef}
              width={200}
              height={100}
              style={{ border: "1px solid #000", touchAction: "none" }}
              onMouseDown={startCustomerDrawing}
              onMouseMove={drawCustomer}
              onMouseUp={stopCustomerDrawing}
              onMouseLeave={stopCustomerDrawing}
              onTouchStart={startCustomerDrawing}
              onTouchMove={drawCustomer}
              onTouchEnd={stopCustomerDrawing}
            />
            <button type="button" onClick={clearCustomerCanvas} className="clear-signature-btn">
              Clear Signature
            </button>
            <small>Signature & Date</small>
          </div>
        )}
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 6
        </button>
      </div>
    </form>
  )
}

export default FormStage
